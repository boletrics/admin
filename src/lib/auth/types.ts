export type Session = {
	user: {
		id: string;
		name: string;
		email: string;
		image?: string | null;
		emailVerified: boolean;
		createdAt: Date;
		updatedAt: Date;
	};
	session: {
		id: string;
		userId: string;
		token: string;
		expiresAt: Date;
		createdAt: Date;
		updatedAt: Date;
		ipAddress?: string;
		userAgent?: string;
	};
} | null;

export type SessionState = {
	data: Session;
	error: Error | null;
	isPending: boolean;
};
