"use client";

import useSWR from "swr";
import { useState, useCallback } from "react";
import {
	listUsers as listUsersApi,
	banUser as banUserApi,
	unbanUser as unbanUserApi,
	setUserRole as setUserRoleApi,
	type ListUsersParams,
	type ListUsersResult,
	type AdminUser,
} from "../../auth/admin";
import type { User, UsersQueryParams, PaginatedResult } from "../types";

// ============================================================================
// Users Hooks (Platform Admin)
// ============================================================================

/**
 * Convert API user to our User type
 */
function mapAdminUserToUser(adminUser: AdminUser): User {
	return {
		id: adminUser.id,
		email: adminUser.email,
		name: adminUser.name ?? null,
		image: adminUser.image ?? null,
		emailVerified: adminUser.emailVerified,
		role: (adminUser.role as string) ?? "user",
		banned: adminUser.banned ?? false,
		banReason: adminUser.banReason ?? null,
		banExpiresAt: adminUser.banExpires?.toISOString() ?? null,
		createdAt: adminUser.createdAt.toISOString(),
		updatedAt: adminUser.updatedAt.toISOString(),
	};
}

/**
 * Fetch all users (from auth-svc admin API via Better Auth client).
 */
export function useUsers(params: UsersQueryParams = {}) {
	// Build Better Auth params from our query params
	const listParams: ListUsersParams = {};

	if (params.search) {
		listParams.searchValue = params.search;
		listParams.searchField = "email";
		listParams.searchOperator = "contains";
	}

	if (params.role) {
		listParams.filterField = "role";
		listParams.filterValue = params.role;
		listParams.filterOperator = "eq";
	}

	if (params.banned !== undefined) {
		listParams.filterField = "banned";
		listParams.filterValue = params.banned;
		listParams.filterOperator = "eq";
	}

	if (params.limit) {
		listParams.limit = params.limit;
	}

	if (params.page && params.limit) {
		listParams.offset = (params.page - 1) * params.limit;
	}

	// Create a unique key for SWR based on params
	const cacheKey = `users-${JSON.stringify(listParams)}`;

	const fetcher = async (): Promise<PaginatedResult<User>> => {
		const result = await listUsersApi(listParams);

		if (result.error || !result.data) {
			throw new Error(result.error || "Failed to fetch users");
		}

		const listResult = result.data as ListUsersResult;
		const users = (listResult.users || []).map(mapAdminUserToUser);

		return {
			data: users,
			pagination: {
				page: params.page || 1,
				limit: params.limit || 50,
				total: listResult.total || users.length,
				totalPages: Math.ceil(
					(listResult.total || users.length) / (params.limit || 50),
				),
			},
		};
	};

	return useSWR<PaginatedResult<User>>(cacheKey, fetcher, {
		revalidateOnFocus: true,
		dedupingInterval: 2000,
	});
}

/**
 * Fetch a single user by ID.
 */
export function useUser(userId: string | null) {
	const fetcher = async (): Promise<User | null> => {
		if (!userId) return null;

		const result = await listUsersApi({
			filterField: "id",
			filterValue: userId,
			filterOperator: "eq",
			limit: 1,
		});

		if (result.error || !result.data) {
			throw new Error(result.error || "Failed to fetch user");
		}

		const users = result.data.users || [];
		return users.length > 0 ? mapAdminUserToUser(users[0]) : null;
	};

	return useSWR<User | null>(userId ? `user-${userId}` : null, fetcher);
}

// ============================================================================
// User Mutations
// ============================================================================

/**
 * Ban a user.
 */
export function useBanUser(userId: string) {
	const [isMutating, setIsMutating] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const banUser = useCallback(
		async (reason?: string, expiresInDays?: number) => {
			setIsMutating(true);
			setError(null);

			try {
				const result = await banUserApi({
					userId,
					banReason: reason,
					banExpiresIn: expiresInDays
						? expiresInDays * 24 * 60 * 60
						: undefined,
				});

				if (result.error) {
					throw new Error(result.error);
				}

				return result.data;
			} catch (err) {
				const error =
					err instanceof Error ? err : new Error("Failed to ban user");
				setError(error);
				throw error;
			} finally {
				setIsMutating(false);
			}
		},
		[userId],
	);

	return { banUser, isMutating, error };
}

/**
 * Unban a user.
 */
export function useUnbanUser(userId: string) {
	const [isMutating, setIsMutating] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const unbanUser = useCallback(async () => {
		setIsMutating(true);
		setError(null);

		try {
			const result = await unbanUserApi(userId);

			if (result.error) {
				throw new Error(result.error);
			}

			return result.data;
		} catch (err) {
			const error =
				err instanceof Error ? err : new Error("Failed to unban user");
			setError(error);
			throw error;
		} finally {
			setIsMutating(false);
		}
	}, [userId]);

	return { unbanUser, isMutating, error };
}

/**
 * Set user role (make admin, remove admin).
 */
export function useSetUserRole(userId: string) {
	const [isMutating, setIsMutating] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const setUserRole = useCallback(
		async (role: string) => {
			setIsMutating(true);
			setError(null);

			try {
				const result = await setUserRoleApi({
					userId,
					role: role as "user" | "admin",
				});

				if (result.error) {
					throw new Error(result.error);
				}

				return result.data;
			} catch (err) {
				const error =
					err instanceof Error ? err : new Error("Failed to set user role");
				setError(error);
				throw error;
			} finally {
				setIsMutating(false);
			}
		},
		[userId],
	);

	return { setUserRole, isMutating, error };
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
	const fetcher = async (): Promise<UserStats> => {
		// Fetch all users to calculate stats
		const result = await listUsersApi({ limit: 1000 });

		if (result.error || !result.data) {
			throw new Error(result.error || "Failed to fetch user stats");
		}

		const users = result.data.users || [];
		const now = new Date();
		const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);

		return {
			total: result.data.total || users.length,
			verified: users.filter((u) => u.emailVerified).length,
			unverified: users.filter((u) => !u.emailVerified).length,
			banned: users.filter((u) => u.banned).length,
			new_this_month: users.filter((u) => new Date(u.createdAt) >= monthAgo)
				.length,
			active_sessions: 0, // Would need a separate API call
		};
	};

	return useSWR<UserStats>("user-stats", fetcher, {
		revalidateOnFocus: false,
		dedupingInterval: 60000, // Cache for 1 minute
	});
}
