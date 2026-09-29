import { StatusCodes } from "http-status-codes";

import type { UserRole } from "../../../generated/prisma/enums";

import { prisma } from "../../../lib/prisma";
import { withTenantScope } from "../../../lib/prismaTenantScope";
import AppError from "../../errors/appError";

import { RESULT_LEADERBOARD_SELECT } from "./result.const";

const getResultByAttemptId = async (
    attemptId: string,
    requester: { id: string; role: UserRole; companyId?: string },
) => {
    const whereClause: Record<string, unknown> = { id: attemptId };

    if (requester.role === "CANDIDATE") {
        whereClause.candidateId = requester.id;
    } else if (requester.role !== "ADMIN") {
        if (!requester.companyId) {
            throw new AppError(StatusCodes.FORBIDDEN, "Access denied. Missing company scope.");
        }
        whereClause.assessment = { companyId: requester.companyId };
    }

    // Now also pulls the two fields needed for the showResultImmediately
    // gate below — previously only { id: true } was selected here.
    const attempt = await prisma.assessmentAttempt.findFirst({
        where: whereClause,
        select: {
            id: true,
            assessment: { select: { showResultImmediately: true, status: true } },
        },
    });

    if (!attempt) {
        // IDOR protection: return 404 instead of 403
        throw new AppError(StatusCodes.NOT_FOUND, "Attempt result not found.");
    }

    // A candidate can only see their result early if showResultImmediately
    // is true; otherwise it stays hidden until the recruiter closes the
    // assessment. Recruiters/Admins are never subject to this gate — they
    // need to see results while grading, regardless of this flag.
    if (
        requester.role === "CANDIDATE" &&
        !attempt.assessment.showResultImmediately &&
        attempt.assessment.status !== "CLOSED"
    ) {
        throw new AppError(
            StatusCodes.FORBIDDEN,
            "Results for this assessment haven't been released yet.",
        );
    }

    const result = await prisma.result.findUnique({
        where: { attemptId },
        select: RESULT_LEADERBOARD_SELECT,
    });

    if (!result) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "Result not available yet — this attempt may not be finalized.",
        );
    }

    return result;
};

/** `companyId` undefined means unscoped — ADMIN browsing any assessment's leaderboard. */
const getResultsForAssessment = async (
    assessmentId: string,
    companyId: string | undefined,
) => {
    // tenant-scoped via withTenantScope
    const assessment = await prisma.assessment.findFirst({
        where: withTenantScope({ id: assessmentId, deletedAt: null }, companyId),
    });

    if (!assessment) {
        throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
    }

    return prisma.result.findMany({
        where: { assessmentId },
        select: RESULT_LEADERBOARD_SELECT,
        orderBy: [
            { totalScore: "desc" },
            { rank: "asc" },
            { evaluatedAt: "asc" },
        ],
    });
};

/**
 * Assigns rank 1..N to every fully-graded (PASSED/FAILED) result for an assessment.
 * Uses optimized SQL window function / bulk transaction to prevent N+1 queries.
 */
const computeRanks = async (assessmentId: string, companyId: string) => {
    // 1. Verify tenant access
    const assessment = await prisma.assessment.findFirst({
        where: withTenantScope({ id: assessmentId, deletedAt: null }, companyId),
    });

    if (!assessment) {
        throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
    }

    // 2. Fetch all finalized results with multi-column sorting for deterministic tie-breaking
    // Order by totalScore DESC, evaluatedAt ASC (first to finish gets better rank)
    const finalizedResults = await prisma.result.findMany({
        where: { 
            assessmentId, 
            status: { in: ["PASSED", "FAILED"] } 
        },
        orderBy: [
            { totalScore: "desc" },
            { evaluatedAt: "asc" },
            { createdAt: "asc" },
        ],
        select: { id: true },
    });

    if (finalizedResults.length === 0) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "No fully-graded results to rank yet.",
        );
    }

    // 3. Perform batch updates inside transaction with chunking for extreme scale
    const CHUNK_SIZE = 100;
    
    await prisma.$transaction(async (tx) => {
        // Clear old ranks for PENDING or invalid status in case status changed back
        await tx.result.updateMany({
            where: { 
                assessmentId, 
                status: "PENDING" 
            },
            data: { rank: null },
        });

        // Batch update ranks using chunking
        for (let i = 0; i < finalizedResults.length; i += CHUNK_SIZE) {
            const chunk = finalizedResults.slice(i, i + CHUNK_SIZE);
            await Promise.all(
                chunk.map((result, index) =>
                    tx.result.update({
                        where: { id: result.id },
                        data: { rank: i + index + 1 },
                    })
                )
            );
        }
    });

    return { ranked: finalizedResults.length };
};

export const resultService = {
    getResultByAttemptId,
    getResultsForAssessment,
    computeRanks,
};