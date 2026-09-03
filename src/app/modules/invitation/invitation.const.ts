/**
 * `tokenHash` is intentionally never selected here — it's an internal
 * artifact (uniqueness/anti-spam guard on the row), not a credential the
 * API hands back. Accepting/declining an invitation is done by an
 * authenticated candidate hitting /invitations/:id/accept, not via a
 * magic-link token, so there's no legitimate reason for a client to ever
 * see it.
 */
export const INVITATION_SELECT = {
	id: true,
	assessmentId: true,
	candidateId: true,
	email: true,
	status: true,
	invitedAt: true,
	acceptedAt: true,
	expiresAt: true,
	completedAt: true,
	assessment: {
		select: {
			id: true,
			title: true,
			slug: true,
			status: true,
			durationMinutes: true,
			totalMarks: true,
			passingMarks: true,
			companyId: true,
		},
	},
} as const;