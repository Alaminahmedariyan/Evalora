import { z } from "zod";

const updateProfileSchema = z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
});

const updateRoleSchema = z.object({
    role: z.enum(["ADMIN", "RECRUITER", "CANDIDATE"]),
});

const updateStatusSchema = z.object({
    status: z.enum(["ACTIVE", "SUSPENDED", "PENDING"]),
});

export const userValidation = { updateProfileSchema, updateRoleSchema, updateStatusSchema };