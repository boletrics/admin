"use client";

import {
	useApiQuery,
	useApiMutation,
	buildQueryString,
	revalidate,
} from "../client";
import type {
	User,
	AdminUser,
	UsersQueryParams,
	UpdateUserInput,
	PaginatedResult,
} from "../types";

// ============================================================================
// Users Hooks (Platform Admin)
// ============================================================================

/**
 * Fetch all users (from auth-svc admin API).
 */
export function useUsers(params: UsersQueryParams = {}) {
	const queryString = buildQueryString(params);
	return useApiQuery<PaginatedResult<User>>(
		`/api/auth/admin/list-users${queryString}`,
	);
}

/**
 * Fetch a single user by ID.
 */
export function useUser(userId: string | null) {
	return useApiQuery<User>(
		userId ? `/api/auth/admin/list-users?id=${userId}` : null,
	);
}

/**
 * Fetch admin users.
 */
export function useAdminUsers() {
	return useApiQuery<AdminUser[]>("/admin-users");
}

// ============================================================================
// User Mutations
// ============================================================================

/**
 * Update a user (ban, role, etc.).
 */
export function useUpdateUser(userId: string) {
	const mutation = useApiMutation<User, UpdateUserInput>(
		`/api/auth/admin/update-user`,
		"POST",
	);

	const updateUser = async (data: UpdateUserInput) => {
		const result = await mutation.trigger({ ...data, userId } as never);
		revalidate(/\/api\/auth\/admin\/list-users/);
		return result;
	};

	return {
		...mutation,
		updateUser,
	};
}

/**
 * Ban a user.
 */
export function useBanUser(userId: string) {
	const mutation = useApiMutation<
		User,
		{ userId: string; banReason?: string; banExpiresIn?: number }
	>(`/api/auth/admin/ban-user`, "POST");

	const banUser = async (reason?: string, expiresInDays?: number) => {
		const result = await mutation.trigger({
			userId,
			banReason: reason,
			banExpiresIn: expiresInDays ? expiresInDays * 24 * 60 * 60 : undefined,
		});
		revalidate(/\/api\/auth\/admin\/list-users/);
		return result;
	};

	return {
		...mutation,
		banUser,
	};
}

/**
 * Unban a user.
 */
export function useUnbanUser(userId: string) {
	const mutation = useApiMutation<User, { userId: string }>(
		`/api/auth/admin/unban-user`,
		"POST",
	);

	const unbanUser = async () => {
		const result = await mutation.trigger({ userId });
		revalidate(/\/api\/auth\/admin\/list-users/);
		return result;
	};

	return {
		...mutation,
		unbanUser,
	};
}

/**
 * Set user role (make admin, remove admin).
 */
export function useSetUserRole(userId: string) {
	const mutation = useApiMutation<User, { userId: string; role: string }>(
		`/api/auth/admin/set-role`,
		"POST",
	);

	const setUserRole = async (role: string) => {
		const result = await mutation.trigger({ userId, role });
		revalidate(/\/api\/auth\/admin\/list-users/);
		return result;
	};

	return {
		...mutation,
		setUserRole,
	};
}

// ============================================================================
// User Stats
// ============================================================================

export interface UserStats {
	total: number;
	verified: number;
	unverified: number;
	banned: number;
	new_this_month: number;
	active_sessions: number;
}

export function useUserStats() {
	return useApiQuery<UserStats>("/api/auth/admin/user-stats");
}
