import { describe, expect, it, vi, beforeEach } from "vitest";
import { getServerSession } from "./getServerSession";
import { cookies } from "next/headers";

vi.mock("next/headers", () => ({
	cookies: vi.fn(),
}));

vi.mock("./config", () => ({
	getAuthServiceUrl: () => "https://auth-svc.test.com",
	getAuthAppUrl: () => "https://auth.test.com",
}));

describe("auth/getServerSession", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubGlobal("fetch", vi.fn());
		// Suppress console.error for expected error cases
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	it("returns null when no session cookie exists", async () => {
		const mockCookies = {
			toString: vi.fn(() => "other-cookie=value"),
		};
		vi.mocked(cookies).mockResolvedValue(mockCookies as any);

		const result = await getServerSession();
		expect(result).toBeNull();
	});

	it("returns null when fetch fails", async () => {
		const mockCookies = {
			toString: vi.fn(() => "better-auth.session_token=abc123"),
		};
		vi.mocked(cookies).mockResolvedValue(mockCookies as any);
		vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

		const result = await getServerSession();
		expect(result).toBeNull();
	});

	it("returns null when response is not ok", async () => {
		const mockCookies = {
			toString: vi.fn(() => "better-auth.session_token=abc123"),
		};
		vi.mocked(cookies).mockResolvedValue(mockCookies as any);
		vi.mocked(fetch).mockResolvedValue(
			new Response(null, { status: 401 }) as any,
		);

		const result = await getServerSession();
		expect(result).toBeNull();
	});

	it("returns session when response is ok and contains user and session", async () => {
		const mockCookies = {
			toString: vi.fn(() => "better-auth.session_token=abc123"),
		};
		vi.mocked(cookies).mockResolvedValue(mockCookies as any);

		const mockSession = {
			user: {
				id: "1",
				name: "Test User",
				email: "test@example.com",
				image: null,
				emailVerified: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			session: {
				id: "session-1",
				userId: "1",
				token: "token-123",
				expiresAt: new Date().toISOString(),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		};

		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify(mockSession), {
				status: 200,
			}) as any,
		);

		const result = await getServerSession();
		expect(result).not.toBeNull();
		expect(result?.user).toEqual(mockSession.user);
		expect(result?.session).toEqual(mockSession.session);
		expect(fetch).toHaveBeenCalledWith(
			"https://auth-svc.test.com/api/auth/get-session",
			{
				headers: {
					Cookie: "better-auth.session_token=abc123",
					Origin: "https://auth.test.com",
				},
				cache: "no-store",
			},
		);
	});

	it("returns null when response is ok but missing user or session", async () => {
		const mockCookies = {
			toString: vi.fn(() => "better-auth.session_token=abc123"),
		};
		vi.mocked(cookies).mockResolvedValue(mockCookies as any);

		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ user: {} }), {
				status: 200,
			}) as any,
		);

		const result = await getServerSession();
		expect(result).toBeNull();
	});
});
