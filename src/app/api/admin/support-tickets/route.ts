import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/getServerSession";
import { getUpstreamApiBaseUrl } from "@/lib/api/config";

/**
 * GET /api/admin/support-tickets
 * Fetch support tickets with filtering
 */
export async function GET(request: NextRequest) {
	const session = await getServerSession();

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const upstreamUrl = `${getUpstreamApiBaseUrl()}/support-tickets?${searchParams.toString()}`;

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
		console.error("Failed to fetch support tickets:", error);
		return NextResponse.json(
			{ error: "Failed to fetch support tickets" },
			{ status: 500 },
		);
	}
}

/**
 * POST /api/admin/support-tickets
 * Create a new support ticket (admin-created)
 */
export async function POST(request: NextRequest) {
	const session = await getServerSession();

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = (await request.json()) as Record<string, unknown>;
		const upstreamUrl = `${getUpstreamApiBaseUrl()}/support-tickets`;

		const response = await fetch(upstreamUrl, {
			method: "POST",
			headers: {
				Authorization: request.headers.get("Authorization") || "",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...body,
				createdByAdminId: session.user.id,
			}),
		});

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error("Failed to create support ticket:", error);
		return NextResponse.json(
			{ error: "Failed to create support ticket" },
			{ status: 500 },
		);
	}
}
