export type NotificationResponse = {
	id: string;
	userId: string;
	title: string;
	message: string;
	type: string;
	isRead: boolean;
	metadata: unknown;
	createdAt: Date;
	updatedAt: Date;
};
