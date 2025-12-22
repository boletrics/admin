// Auth adapter exports - Boletrics implementation based on AML
export { getAuthServiceUrl, getAuthAppUrl } from "./config";
export type { Session } from "./types";
export { sessionStore, setSession, clearSession } from "./sessionStore";
export { getServerSession } from "./getServerSession";
export { authClient, getClientJwt } from "./authClient";
export { getJwt } from "./getJwt";
export { useAuthSession, SessionHydrator } from "./useAuthSession";
export { logout } from "./actions";

// Admin functions for user management
export {
	listUsers,
	createUser,
	banUser,
	unbanUser,
	setUserRole,
	removeUser,
	revokeUserSessions,
	impersonateUser,
	stopImpersonating,
	hasPermission,
	listUserSessions,
} from "./admin";
export type {
	AdminUser,
	UserRole,
	ListUsersParams,
	ListUsersResult,
	CreateUserParams,
	BanUserParams,
	SetRoleParams,
} from "./admin";
