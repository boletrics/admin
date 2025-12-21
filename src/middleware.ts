import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const getAuthAppUrl = () =>
	process.env.NEXT_PUBLIC_AUTH_APP_URL || "https://auth.example.workers.dev";

export function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	if (!sessionCookie) {
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
