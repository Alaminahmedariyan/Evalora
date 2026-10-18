import { z } from "zod";

const shortList = z.array(z.string().trim().min(1).max(300)).max(10);

export const reportResultSchema = z.object({
	riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
	riskSummary: z.string().trim().min(1).max(1000),
	summary: z.string().trim().max(2000).optional(),
	strengths: shortList.optional(),
	weaknesses: shortList.optional(),
	recommendation: z.string().trim().max(1000).optional(),
	aiModel: z.string().trim().min(1).max(100),
});

export type ReportResultInput = z.infer<typeof reportResultSchema>;