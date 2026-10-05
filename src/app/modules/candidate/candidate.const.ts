/**
 * What recruiters and admins see. Nested `user` select is safe inside a
 * flat `select` block (not `include`) because CandidateProfile -> User is a
 * to-one relation.
 */
export const CANDIDATE_DETAIL_SELECT = {
	id: true,
	headline: true,
	bio: true,
	phone: true,
	location: true,
	resumeUrl: true,
	linkedinUrl: true,
	githubUrl: true,
	portfolioUrl: true,
	skills: true,
	experienceYears: true,
	createdAt: true,
	updatedAt: true,
	user: {
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
		},
	},
} as const;

/** The candidate's own view: the same fields plus their visibility setting. */
export const CANDIDATE_OWN_SELECT = {
	...CANDIDATE_DETAIL_SELECT,
	isVisibleToRecruiters: true,
} as const;