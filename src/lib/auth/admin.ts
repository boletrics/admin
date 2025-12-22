"use client";

import { authClient } from "./authClient";

/**
 * Admin API functions for user management.
 * Based on better-auth admin plugin: https://www.better-auth.com/docs/plugins/admin
 */

export type UserRole = "user" | "admin";

export type AdminUser = {
	id: string;
	email: string;
	name: string;
	image?: string | null;
	emailVerified: boolean;
	role?: UserRole | string;
	banned?: boolean;
	banReason?: string | null;
	banExpires?: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

export type ListUsersParams = {
	searchValue?: string;
	searchField?: "email" | "name";
	searchOperator?: "contains" | "starts_with" | "ends_with";
	limit?: number;
	offset?: number;
	sortBy?: string;
	sortDirection?: "asc" | "desc";
	filterField?: string;
	filterValue?: string | number | boolean;
	filterOperator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte";
};

export type ListUsersResult = {
	users: AdminUser[];
	total: number;
	limit?: number;
	offset?: number;
};

export type CreateUserParams = {
	email: string;
	password: string;
	name: string;
	role?: UserRole;
	data?: Record<string, unknown>;
};

export type BanUserParams = {
	userId: string;
	banReason?: string;
	banExpiresIn?: number; // seconds
};

export type SetRoleParams = {
	userId: string;
	role: UserRole;
};

type ApiResult<T> = {
	data: T | null;
	error: string | null;
};

// Helper to extract user from response
function extractUser(data: unknown): AdminUser | null {
	if (!data || typeof data !== "object") return null;
	const obj = data as { user?: unknown };
	if (!obj.user) return null;
	return obj.user as AdminUser;
}

/**
 * List all users with optional filtering, searching, and pagination.
 */
export async function listUsers(
	params?: ListUsersParams,
): Promise<ApiResult<ListUsersResult>> {
	try {
		const result = await authClient.admin.listUsers({
			query: params ?? {},
		});

		if (result.error) {
			return {
				data: null,
				error: result.error.message || "Failed to list users",
			};
		}

		return {
			data: result.data as unknown as ListUsersResult,
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unexpected error",
		};
	}
}

/**
 * Create a new user as an admin.
 */
export async function createUser(
	params: CreateUserParams,
): Promise<ApiResult<AdminUser>> {
	try {
		const result = await authClient.admin.createUser({
			email: params.email,
			password: params.password,
			name: params.name,
			role: params.role,
			data: params.data as Record<string, unknown> | undefined,
		});

		if (result.error) {
			return {
				data: null,
				error: result.error.message || "Failed to create user",
			};
		}

		return {
			data: extractUser(result.data),
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unexpected error",
		};
	}
}

/**
 * Ban a user from the application.
 */
export async function banUser(
	params: BanUserParams,
): Promise<ApiResult<AdminUser>> {
	try {
		const result = await authClient.admin.banUser(params);

		if (result.error) {
			return {
				data: null,
				error: result.error.message || "Failed to ban user",
			};
		}

		return {
			data: extractUser(result.data),
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unexpected error",
		};
	}
}

/**
 * Unban a previously banned user.
 */
export async function unbanUser(userId: string): Promise<ApiResult<AdminUser>> {
	try {
		const result = await authClient.admin.unbanUser({ userId });

		if (result.error) {
			return {
				data: null,
				error: result.error.message || "Failed to unban user",
			};
		}

		return {
			data: extractUser(result.data),
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unexpected error",
		};
	}
}

/**
 * Set a user's role.
 */
export async function setUserRole(
	params: SetRoleParams,
): Promise<ApiResult<AdminUser>> {
	try {
		const result = await authClient.admin.setRole({
			userId: params.userId,
			role: params.role,
		});

		if (result.error) {
			return {
				data: null,
				error: result.error.message || "Failed to set user role",
			};
		}

		return {
			data: extractUser(result.data),
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unexpected error",
		};
	}
}

/**
 * Remove a user from the system.
 */
export async function removeUser(userId: string): Promise<ApiResult<boolean>> {
	try {
		const result = await authClient.admin.removeUser({ userId });

		if (result.error) {
			return {
				data: null,
				error: result.error.message || "Failed to remove user",
			};
		}

		return {
			data: true,
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unexpected error",
		};
	}
}

/**
 * Revoke all sessions for a user.
 */
export async function revokeUserSessions(
	userId: string,
): Promise<ApiResult<boolean>> {
	try {
		const result = await authClient.admin.revokeUserSessions({ userId });

		if (result.error) {
			return {
				data: null,
				error: result.error.message || "Failed to revoke sessions",
			};
		}

		return {
			data: true,
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unexpected error",
		};
	}
}

/**
 * Impersonate a user (creates a session as that user).
 * Only admins can impersonate other users.
 */
export async function impersonateUser(
	userId: string,
): Promise<ApiResult<{ session: unknown; user: AdminUser }>> {
	try {
		const result = await authClient.admin.impersonateUser({ userId });

		if (result.error) {
			return {
				data: null,
				error: result.error.message || "Failed to impersonate user",
			};
		}

		return {
			data: result.data as unknown as { session: unknown; user: AdminUser },
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unexpected error",
		};
	}
}

/**
 * Stop impersonating a user and return to the admin session.
 */
export async function stopImpersonating(): Promise<ApiResult<boolean>> {
	try {
		const result = await authClient.admin.stopImpersonating();

		if (result.error) {
			return {
				data: null,
				error: result.error.message || "Failed to stop impersonating",
			};
		}

		return {
			data: true,
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unexpected error",
		};
	}
}

/**
 * Check if the current user has a specific permission.
 */
export async function hasPermission(
	permission: Record<string, string[]>,
): Promise<ApiResult<boolean>> {
	try {
		const result = await authClient.admin.hasPermission({
			permission,
		});

		if (result.error) {
			return {
				data: null,
				error: result.error.message || "Failed to check permission",
			};
		}

		return {
			data: result.data?.success ?? false,
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unexpected error",
		};
	}
}

/**
 * List all sessions for a specific user.
 */
export async function listUserSessions(
	userId: string,
): Promise<ApiResult<unknown[]>> {
	try {
		const result = await authClient.admin.listUserSessions({ userId });

		if (result.error) {
			return {
				data: null,
				error: result.error.message || "Failed to list sessions",
			};
		}

		return {
			data: (result.data?.sessions as unknown[]) ?? [],
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unexpected error",
		};
	}
}
