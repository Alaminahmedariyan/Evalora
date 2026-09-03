export type RegisterCompanyInput = {
	name: string;
	description?: string;
	website?: string;
	industry?: string;
};

export type UpdateCompanyInput = Partial<{
	name: string;
	description: string;
	website: string;
	industry: string;
	logo: string;
}>;