import { describe, expect, it, vi, beforeEach } from "vitest";
import { logout } from "./actions";
import { clearSession } from "./sessionStore";

vi.mock("./authClient", () => ({
	authClient: {
		signOut: vi.fn(),
	},
}));

vi.mock("./sessionStore", () => ({
	clearSession: vi.fn(),
}));

vi.mock("./config", () => ({
	getAuthAppUrl: () => "https://auth.example.com",
}));

describe("auth/actions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset window.location
		Object.defineProperty(window, "location", {
			value: { href: "" },
			writable: true,
		});
	});

	it("calls signOut and redirects on success", async () => {
		const { authClient } = await import("./authClient");
		const mockOnSuccess = vi.fn();

		vi.mocked(authClient.signOut).mockImplementation((options) => {
			// Simulate onSuccess callback being called
			if (options?.fetchOptions?.onSuccess) {
				options.fetchOptions.onSuccess({
					data: null,
					response: new Response(),
					request: new Request("https://example.com"),
				} as Parameters<NonNullable<typeof options.fetchOptions.onSuccess>>[0]);
			}
			return Promise.resolve();
		});

		await logout();

		expect(authClient.signOut).toHaveBeenCalledWith({
			fetchOptions: {
				onSuccess: expect.any(Function),
			},
		});
		expect(clearSession).toHaveBeenCalled();
		expect(window.location.href).toBe("https://auth.example.com/login");
	});

	it("clears session and redirects on error", async () => {
		const { authClient } = await import("./authClient");

		vi.mocked(authClient.signOut).mockRejectedValue(new Error("Network error"));

		await logout();

		expect(clearSession).toHaveBeenCalled();
		expect(window.location.href).toBe("https://auth.example.com/login");
	});
});
