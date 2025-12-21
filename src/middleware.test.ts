import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { middleware } from "./middleware";

vi.mock("better-auth/cookies", () => ({
	getSessionCookie: vi.fn(),
}));

vi.mock("./middleware", async () => {
	const actual =
		await vi.importActual<typeof import("./middleware")>("./middleware");
	return {
		...actual,
	};
});

describe("middleware", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.NEXT_PUBLIC_AUTH_APP_URL = "https://auth.example.com";
	});

	it("redirects to auth app when no session cookie", async () => {
		const { getSessionCookie } = await import("better-auth/cookies");
		vi.mocked(getSessionCookie).mockReturnValue(null);

		const request = new NextRequest("https://example.com/admin/users");
		const response = middleware(request);

		expect(response).toBeInstanceOf(NextResponse);
		expect(response.status).toBe(307);
		const location = response.headers.get("location");
		expect(location).toContain("https://auth.example.com/login");
		expect(location).toContain("redirect_to=");
		expect(location).toContain(
			encodeURIComponent("https://example.com/admin/users"),
		);
	});

	it("allows request when session cookie exists", async () => {
		const { getSessionCookie } = await import("better-auth/cookies");
		vi.mocked(getSessionCookie).mockReturnValue("session-token");

		const request = new NextRequest("https://example.com/admin/users");
		const response = middleware(request);

		expect(response).toBeInstanceOf(NextResponse);
		expect(response.status).toBe(200);
	});

	it("uses default auth URL when env var is not set", async () => {
		delete process.env.NEXT_PUBLIC_AUTH_APP_URL;
		const { getSessionCookie } = await import("better-auth/cookies");
		vi.mocked(getSessionCookie).mockReturnValue(null);

		const request = new NextRequest("https://example.com/admin/users");
		const response = middleware(request);

		const location = response.headers.get("location");
		expect(location).toContain("https://auth.example.workers.dev/login");
	});
});
