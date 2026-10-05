// null means "clear this field"; leaving a key out means "don't touch it".
export type UpsertCandidateProfileInput = Partial<{
	headline: string | null;
	bio: string | null;
	phone: string | null;
	location: string | null;
	linkedinUrl: string | null;
	githubUrl: string | null;
	portfolioUrl: string | null;
	skills: string[];
	experienceYears: number | null;
	isVisibleToRecruiters: boolean;
}>;