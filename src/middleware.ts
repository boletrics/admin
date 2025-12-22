import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const getAuthAppUrl = () => {
	return (
		process.env.NEXT_PUBLIC_AUTH_APP_URL || "https://auth.example.workers.dev"
	);
};

const getAuthServiceUrl = () => {
	return (
		process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ||
		"https://auth-svc.example.workers.dev"
	);
};

// Roles that are allowed to access the admin app
const ADMIN_ROLES = ["admin"];

type SessionUser = {
	id: string;
	email: string;
	name?: string;
	role?: string;
	banned?: boolean;
};

type SessionData = {
	session?: unknown;
	user?: SessionUser;
};

function redirectToLogin(request: NextRequest): NextResponse {
	const authAppUrl = getAuthAppUrl();
	const returnUrl = encodeURIComponent(request.url);
	return NextResponse.redirect(`${authAppUrl}/login?redirect_to=${returnUrl}`);
}

function redirectToUnauthorized(request: NextRequest): NextResponse {
	const url = request.nextUrl.clone();
	url.pathname = "/unauthorized";
	return NextResponse.rewrite(url);
}

// Routes that don't require authentication (user handles login flow themselves)
const PUBLIC_ROUTES = ["/unauthorized"];

function isPublicRoute(pathname: string): boolean {
	return PUBLIC_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);
}

function isAdminUser(user: SessionUser): boolean {
	// Check if user has admin role
	if (!user.role) return false;
	return ADMIN_ROLES.includes(user.role);
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow public routes without session validation
	if (isPublicRoute(pathname)) {
		return NextResponse.next();
	}

	const sessionCookie = getSessionCookie(request);

	// No session cookie → redirect to auth app
	if (!sessionCookie) {
		return redirectToLogin(request);
	}

	// Validate session with auth service
	try {
		const cookieHeader = request.headers.get("cookie") || "";
		const response = await fetch(
			`${getAuthServiceUrl()}/api/auth/get-session`,
			{
				headers: {
					Cookie: cookieHeader,
					Origin: getAuthAppUrl(),
				},
				cache: "no-store",
			},
		);

		// Invalid/expired session → redirect to auth app
		if (!response.ok) {
			return redirectToLogin(request);
		}

		const data = (await response.json()) as SessionData;

		// No valid session data → redirect to auth app
		if (!data?.session || !data?.user) {
			return redirectToLogin(request);
		}

		// Check if user is banned
		if (data.user.banned) {
			return redirectToLogin(request);
		}

		// Check if user has admin role
		if (!isAdminUser(data.user)) {
			return redirectToUnauthorized(request);
		}
	} catch {
		// Auth service error → redirect to auth app
		return redirectToLogin(request);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
