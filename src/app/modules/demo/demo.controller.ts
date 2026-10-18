import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { applyAuthCookies } from "../../utils/authCookies";
import { catchAsync } from "../../utils/catchAsync";

import { demoService } from "./demo.service";

export const demoLoginSchema = z.object({
	body: z.object({
		role: z.enum(["CANDIDATE", "RECRUITER", "ADMIN"]),
	}),
});

const demoLogin = catchAsync(async (req: Request, res: Response) => {
	const { data, headers } = await demoService.demoLogin(
		req.body.role,
		fromNodeHeaders(req.headers),
	);

	applyAuthCookies(headers, res);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Demo session started.",
		data,
	});
});

export const demoController = { demoLogin };