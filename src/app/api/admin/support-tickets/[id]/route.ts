import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/getServerSession";
import { getUpstreamApiBaseUrl } from "@/lib/api/config";

/**
 * GET /api/admin/support-tickets/[id]
 * Fetch a specific support ticket
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await getServerSession();

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { id } = await params;
	const upstreamUrl = `${getUpstreamApiBaseUrl()}/support-tickets/${id}?include=messages,user,organization`;

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
		console.error("Failed to fetch support ticket:", error);
		return NextResponse.json(
			{ error: "Failed to fetch support ticket" },
			{ status: 500 },
		);
	}
}

/**
 * PUT /api/admin/support-tickets/[id]
 * Update a support ticket (status, priority, assignee)
 */
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await getServerSession();

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { id } = await params;

	try {
		const body = await request.json();
		const upstreamUrl = `${getUpstreamApiBaseUrl()}/support-tickets/${id}`;

		const response = await fetch(upstreamUrl, {
			method: "PUT",
			headers: {
				Authorization: request.headers.get("Authorization") || "",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error("Failed to update support ticket:", error);
		return NextResponse.json(
			{ error: "Failed to update support ticket" },
			{ status: 500 },
		);
	}
}
