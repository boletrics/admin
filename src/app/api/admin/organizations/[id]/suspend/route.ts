import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/getServerSession";
import { getUpstreamApiBaseUrl } from "@/lib/api/config";

/**
 * POST /api/admin/organizations/[id]/suspend
 * Suspend an organization
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await getServerSession();

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { id } = await params;
	const upstreamUrl = `${getUpstreamApiBaseUrl()}/organizations/${id}`;

	try {
		const response = await fetch(upstreamUrl, {
			method: "PUT",
			headers: {
				Authorization: request.headers.get("Authorization") || "",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ status: "suspended" }),
		});

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error("Failed to suspend organization:", error);
		return NextResponse.json(
			{ error: "Failed to suspend organization" },
			{ status: 500 },
		);
	}
}
