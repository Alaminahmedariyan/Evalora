import { prisma } from "../../src/lib/prisma";
import { createUserWithRole, type AuthenticatedTestUser } from "./auth";

export type CompanyWithRecruiter = {
	recruiter: AuthenticatedTestUser;
	company: {
		id: string;
		name: string;
		slug: string;
	};
};

let companyCounter = 0;

export async function createCompanyWithRecruiter(
	companyName?: string,
): Promise<CompanyWithRecruiter> {
	const recruiter = await createUserWithRole("RECRUITER");
	companyCounter += 1;
	const name = companyName ?? `Test Company ${Date.now()}-${companyCounter}`;
	const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}-${companyCounter}`;

	const company = await prisma.company.create({
		data: {
			name,
			slug,
			ownerId: recruiter.id,
		},
		select: {
			id: true,
			name: true,
			slug: true,
		},
	});

	return {
		recruiter,
		company,
	};
}
