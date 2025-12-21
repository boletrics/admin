import { describe, expect, it, vi, beforeEach } from "vitest";
import { cookies } from "next/headers";
import { getServerSession } from "./getServerSession";
import type { Session } from "./types";

vi.mock("next/headers", () => ({
	cookies: vi.fn(),
}));

vi.mock("./config", () => ({
	getAuthCoreBaseUrl: () => "https://auth-svc.example.com",
}));

describe("auth/getServerSession", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns session when API returns valid session", async () => {
		const mockSessionData = {
			user: {
				id: "user-1",
				name: "Test User",
				email: "test@example.com",
				emailVerified: true,
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			},
			session: {
				id: "session-1",
				userId: "user-1",
				token: "token-123",
				expiresAt: "2024-12-31T00:00:00.000Z",
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			},
		};

		vi.mocked(cookies).mockResolvedValue({
			toString: () => "session=abc123",
		} as unknown as Awaited<ReturnType<typeof cookies>>);

		vi.stubGlobal(
			"fetch",
			vi.fn(async () => {
				return new Response(JSON.stringify(mockSessionData), {
					status: 200,
					headers: { "content-type": "application/json" },
				});
			}),
		);

		const result = await getServerSession();
		expect(result).not.toBeNull();
		expect(result?.user.id).toBe("user-1");
		expect(result?.user.email).toBe("test@example.com");
		expect(result?.session.id).toBe("session-1");
	});

	it("returns null when API returns non-ok response", async () => {
		vi.mocked(cookies).mockResolvedValue({
			toString: () => "session=abc123",
		} as unknown as Awaited<ReturnType<typeof cookies>>);

		vi.stubGlobal(
			"fetch",
			vi.fn(async () => {
				return new Response("Unauthorized", {
					status: 401,
				});
			}),
		);

		const result = await getServerSession();
		expect(result).toBeNull();
	});

	it("returns null when API response has no user", async () => {
		vi.mocked(cookies).mockResolvedValue({
			toString: () => "session=abc123",
		} as unknown as Awaited<ReturnType<typeof cookies>>);

		vi.stubGlobal(
			"fetch",
			vi.fn(async () => {
				return new Response(JSON.stringify({}), {
					status: 200,
					headers: { "content-type": "application/json" },
				});
			}),
		);

		const result = await getServerSession();
		expect(result).toBeNull();
	});

	it("returns null when fetch throws an error", async () => {
		vi.mocked(cookies).mockResolvedValue({
			toString: () => "session=abc123",
		} as unknown as Awaited<ReturnType<typeof cookies>>);

		vi.stubGlobal(
			"fetch",
			vi.fn(async () => {
				throw new Error("Network error");
			}),
		);

		const result = await getServerSession();
		expect(result).toBeNull();
	});

	it("includes cookies in request headers", async () => {
		vi.mocked(cookies).mockResolvedValue({
			toString: () => "session=abc123; other=value",
		} as unknown as Awaited<ReturnType<typeof cookies>>);

		vi.stubGlobal(
			"fetch",
			vi.fn(async (url: string, options?: RequestInit) => {
				expect(options?.headers).toHaveProperty(
					"Cookie",
					"session=abc123; other=value",
				);
				return new Response(JSON.stringify({}), {
					status: 200,
					headers: { "content-type": "application/json" },
				});
			}),
		);

		await getServerSession();
	});
});
