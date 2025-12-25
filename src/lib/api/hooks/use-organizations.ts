"use client";

import {
	useApiQuery,
	useApiMutation,
	buildQueryString,
	revalidate,
} from "../client";
import type {
	Organization,
	OrganizationWithSettings,
	OrganizationsQueryParams,
	OrganizationSettings,
	UpdateOrganizationSettingsInput,
	PaginatedResult,
} from "../types";

// ============================================================================
// Organizations Hooks (Platform Admin)
// Organization identity comes from auth-svc, settings from tickets-svc
// ============================================================================

/**
 * Fetch all organizations (platform-wide) with their settings.
 * In production, this calls auth-svc for org identity and merges with tickets-svc settings.
 */
export function useOrganizations(params: OrganizationsQueryParams = {}) {
	const queryString = buildQueryString(params);
	// The admin API merges org identity from auth-svc with settings from tickets-svc
	return useApiQuery<PaginatedResult<OrganizationWithSettings>>(
		`/admin/organizations${queryString}`,
	);
}

/**
 * Fetch all organization settings from tickets-svc.
 */
export function useOrganizationSettings(params: OrganizationsQueryParams = {}) {
	const queryString = buildQueryString(params);
	return useApiQuery<PaginatedResult<OrganizationSettings>>(
		`/org-settings${queryString}`,
	);
}

/**
 * Fetch pending organizations for approval.
 */
export function usePendingOrganizations(
	params: Omit<OrganizationsQueryParams, "status"> = {},
) {
	const queryString = buildQueryString({ ...params, status: "pending" });
	return useApiQuery<PaginatedResult<OrganizationSettings>>(
		`/org-settings${queryString}`,
	);
}

/**
 * Fetch suspended organizations.
 */
export function useSuspendedOrganizations(
	params: Omit<OrganizationsQueryParams, "status"> = {},
) {
	const queryString = buildQueryString({ ...params, status: "suspended" });
	return useApiQuery<PaginatedResult<OrganizationSettings>>(
		`/org-settings${queryString}`,
	);
}

/**
 * Fetch a single organization by ID from auth-svc.
 */
export function useOrganization(orgId: string | null) {
	return useApiQuery<Organization>(
		orgId ? `/admin/organizations/${orgId}` : null,
	);
}

/**
 * Fetch settings for a single organization from tickets-svc.
 */
export function useOrgSettingsById(orgId: string | null) {
	return useApiQuery<OrganizationSettings>(
		orgId ? `/org-settings/${orgId}` : null,
	);
}

// ============================================================================
// Organization Settings Mutations (tickets-svc)
// ============================================================================

/**
 * Update organization settings (status, plan, commission rate).
 */
export function useUpdateOrgSettings(orgId: string) {
	const mutation = useApiMutation<
		OrganizationSettings,
		UpdateOrganizationSettingsInput
	>(`/org-settings/${orgId}`, "PUT");

	const updateSettings = async (data: UpdateOrganizationSettingsInput) => {
		const result = await mutation.trigger(data);
		revalidate(`/org-settings/${orgId}`);
		revalidate(/\/org-settings/);
		return result;
	};

	return {
		...mutation,
		updateSettings,
	};
}

/**
 * Approve a pending organization.
 */
export function useApproveOrganization(orgId: string) {
	const mutation = useApiMutation<OrganizationSettings, { status: "active" }>(
		`/org-settings/${orgId}`,
		"PUT",
	);

	const approveOrganization = async () => {
		const result = await mutation.trigger({ status: "active" });
		revalidate(/\/org-settings/);
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
export function useSuspendOrganization(orgId: string) {
	const mutation = useApiMutation<
		OrganizationSettings,
		{ status: "suspended" }
	>(`/org-settings/${orgId}`, "PUT");

	const suspendOrganization = async () => {
		const result = await mutation.trigger({ status: "suspended" });
		revalidate(/\/org-settings/);
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
export function useReactivateOrganization(orgId: string) {
	const mutation = useApiMutation<OrganizationSettings, { status: "active" }>(
		`/org-settings/${orgId}`,
		"PUT",
	);

	const reactivateOrganization = async () => {
		const result = await mutation.trigger({ status: "active" });
		revalidate(/\/org-settings/);
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
