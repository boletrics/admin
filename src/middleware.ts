import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const getAuthAppUrl = () =>
	process.env.NEXT_PUBLIC_AUTH_APP_URL || "https://auth.example.workers.dev";

const getAuthCoreBaseUrl = () =>
	process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ||
	"https://auth-svc.example.workers.dev";

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	if (!sessionCookie) {
		const returnUrl = encodeURIComponent(request.url);
		return NextResponse.redirect(
			`${getAuthAppUrl()}/login?redirect_to=${returnUrl}`,
		);
	}

	// Validate session by checking with auth service
	try {
		const response = await fetch(
			`${getAuthCoreBaseUrl()}/api/auth/get-session`,
			{
				headers: {
					Cookie: request.headers.get("cookie") || "",
				},
				cache: "no-store",
			},
		);

		if (!response.ok) {
			const returnUrl = encodeURIComponent(request.url);
			return NextResponse.redirect(
				`${getAuthAppUrl()}/login?redirect_to=${returnUrl}`,
			);
		}

		const data = (await response.json()) as { user?: unknown } | null;
		if (!data || !data.user) {
			const returnUrl = encodeURIComponent(request.url);
			return NextResponse.redirect(
				`${getAuthAppUrl()}/login?redirect_to=${returnUrl}`,
			);
		}
	} catch {
		// If validation fails, redirect to login
		const returnUrl = encodeURIComponent(request.url);
		return NextResponse.redirect(
			`${getAuthAppUrl()}/login?redirect_to=${returnUrl}`,
		);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
