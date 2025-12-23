"use client";

import {
	useApiQuery,
	useApiMutation,
	buildQueryString,
	revalidate,
} from "../client";
import type {
	Organization,
	OrganizationsQueryParams,
	UpdateOrganizationInput,
	PaginatedResult,
} from "../types";

// ============================================================================
// Organizations Hooks (Platform Admin)
// ============================================================================

/**
 * Fetch all organizations (platform-wide).
 */
export function useOrganizations(params: OrganizationsQueryParams = {}) {
	const queryString = buildQueryString(params);
	return useApiQuery<PaginatedResult<Organization>>(
		`/organizations${queryString}`,
	);
}

/**
 * Fetch pending organizations for approval.
 */
export function usePendingOrganizations(
	params: Omit<OrganizationsQueryParams, "status"> = {},
) {
	const queryString = buildQueryString({ ...params, status: "pending" });
	return useApiQuery<PaginatedResult<Organization>>(
		`/organizations${queryString}`,
	);
}

/**
 * Fetch suspended organizations.
 */
export function useSuspendedOrganizations(
	params: Omit<OrganizationsQueryParams, "status"> = {},
) {
	const queryString = buildQueryString({ ...params, status: "suspended" });
	return useApiQuery<PaginatedResult<Organization>>(
		`/organizations${queryString}`,
	);
}

/**
 * Fetch a single organization by ID.
 */
export function useOrganization(organizationId: string | null) {
	return useApiQuery<Organization>(
		organizationId ? `/organizations/${organizationId}` : null,
	);
}

// ============================================================================
// Organization Mutations
// ============================================================================

/**
 * Update an organization (status, plan, commission rate).
 */
export function useUpdateOrganization(organizationId: string) {
	const mutation = useApiMutation<Organization, UpdateOrganizationInput>(
		`/organizations/${organizationId}`,
		"PUT",
	);

	const updateOrganization = async (data: UpdateOrganizationInput) => {
		const result = await mutation.trigger(data);
		revalidate(`/organizations/${organizationId}`);
		revalidate(/\/organizations/);
		return result;
	};

	return {
		...mutation,
		updateOrganization,
	};
}

/**
 * Approve a pending organization.
 */
export function useApproveOrganization(organizationId: string) {
	const mutation = useApiMutation<Organization, { status: "active" }>(
		`/organizations/${organizationId}`,
		"PUT",
	);

	const approveOrganization = async () => {
		const result = await mutation.trigger({ status: "active" });
		revalidate(/\/organizations/);
		return result;
	};

	return {
		...mutation,
		approveOrganization,
	};
}

/**
 * Suspend an organization.
 */
export function useSuspendOrganization(organizationId: string) {
	const mutation = useApiMutation<Organization, { status: "suspended" }>(
		`/organizations/${organizationId}`,
		"PUT",
	);

	const suspendOrganization = async () => {
		const result = await mutation.trigger({ status: "suspended" });
		revalidate(/\/organizations/);
		return result;
	};

	return {
		...mutation,
		suspendOrganization,
	};
}

/**
 * Reactivate a suspended organization.
 */
export function useReactivateOrganization(organizationId: string) {
	const mutation = useApiMutation<Organization, { status: "active" }>(
		`/organizations/${organizationId}`,
		"PUT",
	);

	const reactivateOrganization = async () => {
		const result = await mutation.trigger({ status: "active" });
		revalidate(/\/organizations/);
		return result;
	};

	return {
		...mutation,
		reactivateOrganization,
	};
}

// ============================================================================
// Organization Stats
// ============================================================================

export interface OrganizationStats {
	total: number;
	by_status: Record<string, number>;
	by_plan: Record<string, number>;
	new_this_month: number;
}

export function useOrganizationStats() {
	return useApiQuery<OrganizationStats>("/organizations/stats");
}
