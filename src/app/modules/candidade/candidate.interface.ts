export type UpsertCandidateProfileInput = Partial<{
	headline: string;
	bio: string;
	phone: string;
	location: string;
	linkedinUrl: string;
	githubUrl: string;
	portfolioUrl: string;
	skills: string[];
	experienceYears: number;
}>;