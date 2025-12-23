import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/getServerSession";
import { getUpstreamApiBaseUrl } from "@/lib/api/config";

/**
 * GET /api/admin/organizations
 * Proxy to auth-svc organizations endpoint with admin filtering
 */
export async function GET(request: NextRequest) {
	const session = await getServerSession();

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// In production, verify admin role from the session
	// For now, we'll proxy the request to auth-svc

	const { searchParams } = new URL(request.url);
	const upstreamUrl = `${getUpstreamApiBaseUrl()}/organizations?${searchParams.toString()}`;

	try {
		const response = await fetch(upstreamUrl, {
			headers: {
				Authorization: request.headers.get("Authorization") || "",
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error("Failed to fetch organizations:", error);
		return NextResponse.json(
			{ error: "Failed to fetch organizations" },
			{ status: 500 },
		);
	}
}
