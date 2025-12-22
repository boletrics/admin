export type Session = {
	user: {
		id: string;
		name: string;
		email: string;
		image: string | null;
		emailVerified: boolean;
		role?: string;
		banned?: boolean;
		banReason?: string | null;
		banExpires?: Date | null;
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
		impersonatedBy?: string;
		ipAddress?: string;
		userAgent?: string;
	};
} | null;
