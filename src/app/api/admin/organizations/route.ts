import { NextRequest, NextResponse } from "next/server";
import { getAuthServiceUrl } from "@/lib/auth/config";
import { getUpstreamApiBaseUrl } from "@/lib/api/config";

interface AuthSvcOrganization {
	id: string;
	name: string;
	slug: string;
	logo?: string | null;
	metadata?: Record<string, unknown> | null;
	createdAt: string;
	member_count?: number;
}

interface TicketsSvcOrgSettings {
	org_id: string;
	email?: string;
	status?: string;
	plan?: string;
	// ... other fields
}

interface AuthSvcResponse {
	success?: boolean;
	result?: {
		data?: AuthSvcOrganization[];
		pagination?: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
		};
	};
	data?: AuthSvcOrganization[];
	pagination?: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

interface SettingsResponse {
	success?: boolean;
	result?: TicketsSvcOrgSettings[];
	[key: string]: unknown;
}

/**
 * GET /api/admin/organizations
 * Fetches organizations from auth-svc and merges with settings from tickets-svc.
 * Auth-svc verifies admin role via session cookie.
 */
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const authSvcUrl = getAuthServiceUrl();
	const ticketsSvcUrl = getUpstreamApiBaseUrl();

	const cookieHeader = request.headers.get("cookie") || "";

	try {
		// Fetch organizations from auth-svc
		const authSvcParams = new URLSearchParams();
		if (searchParams.get("search"))
			authSvcParams.set("search", searchParams.get("search")!);
		if (searchParams.get("page"))
			authSvcParams.set("page", searchParams.get("page")!);
		if (searchParams.get("limit"))
			authSvcParams.set("limit", searchParams.get("limit")!);

		const authResponse = await fetch(
			`${authSvcUrl}/admin/organizations?${authSvcParams.toString()}`,
			{
				headers: {
					Cookie: cookieHeader,
					Accept: "application/json",
				},
				cache: "no-store",
			},
		);

		if (!authResponse.ok) {
			const errorData = await authResponse.json();
			return NextResponse.json(errorData, { status: authResponse.status });
		}

		const authData = (await authResponse.json()) as AuthSvcResponse;

		// Extract organizations and pagination
		let organizations: AuthSvcOrganization[] = [];
		let pagination = { page: 1, limit: 50, total: 0, totalPages: 0 };

		if (authData.success && authData.result) {
			organizations = authData.result.data || [];
			pagination = authData.result.pagination || pagination;
		} else if (authData.data) {
			organizations = authData.data;
			pagination = authData.pagination || pagination;
		}

		// Fetch org-settings from tickets-svc to merge statuses
		// Filter by status if specified
		const statusFilter = searchParams.get("status");
		let settingsMap = new Map<string, TicketsSvcOrgSettings>();

		if (organizations.length > 0) {
			try {
				// Get all org settings (we could optimize with bulk query in the future)
				const settingsResponse = await fetch(
					`${ticketsSvcUrl}/org-settings?limit=500`,
					{
						headers: {
							Cookie: cookieHeader,
							Accept: "application/json",
						},
						cache: "no-store",
					},
				);

				if (settingsResponse.ok) {
					const settingsData =
						(await settingsResponse.json()) as SettingsResponse;
					const settingsArray: TicketsSvcOrgSettings[] = settingsData.success
						? settingsData.result || []
						: Array.isArray(settingsData)
							? (settingsData as unknown as TicketsSvcOrgSettings[])
							: [];

					for (const s of settingsArray) {
						settingsMap.set(s.org_id, s);
					}
				}
			} catch (e) {
				// Settings fetch failed; continue with just org identity
				console.warn("Failed to fetch org-settings:", e);
			}
		}

		// Merge organizations with their settings
		let merged = organizations.map((org) => {
			const settings = settingsMap.get(org.id);
			return {
				...org,
				settings: settings || null,
			};
		});

		// Apply status filter if specified
		if (statusFilter) {
			merged = merged.filter((org) => org.settings?.status === statusFilter);
		}

		return NextResponse.json({
			data: merged,
			pagination: {
				...pagination,
				total: statusFilter ? merged.length : pagination.total,
				totalPages: statusFilter
					? Math.ceil(merged.length / pagination.limit)
					: pagination.totalPages,
			},
		});
	} catch (error) {
		console.error("Failed to fetch organizations:", error);
		return NextResponse.json(
			{ error: "Failed to fetch organizations" },
			{ status: 500 },
		);
	}
}
