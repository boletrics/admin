import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/getServerSession";
import { getUpstreamApiBaseUrl } from "@/lib/api/config";

/**
 * POST /api/admin/support-tickets/[id]/messages
 * Add a message to a support ticket
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

	try {
		const body = (await request.json()) as Record<string, unknown>;
		const upstreamUrl = `${getUpstreamApiBaseUrl()}/support-tickets/${id}/messages`;

		const response = await fetch(upstreamUrl, {
			method: "POST",
			headers: {
				Authorization: request.headers.get("Authorization") || "",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...body,
				authorId: session.user.id,
				authorRole: "admin",
			}),
		});

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error("Failed to add message:", error);
		return NextResponse.json(
			{ error: "Failed to add message" },
			{ status: 500 },
		);
	}
}
