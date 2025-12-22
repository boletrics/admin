import { describe, expect, it, vi, beforeEach } from "vitest";
import { logout } from "./actions";
import { authClient } from "./authClient";
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
	getAuthAppUrl: () => "https://auth.test.com",
}));

describe("auth/actions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Mock window.location
		delete (window as any).location;
		(window as any).location = { href: "" };
	});

	it("calls signOut and redirects on success", async () => {
		vi.mocked(authClient.signOut).mockResolvedValue(undefined as any);

		await logout();

		expect(authClient.signOut).toHaveBeenCalledWith({
			fetchOptions: {
				onSuccess: expect.any(Function),
			},
		});

		// Call the onSuccess callback
		const callArgs = vi.mocked(authClient.signOut).mock.calls[0][0];
		if (callArgs?.fetchOptions?.onSuccess) {
			callArgs.fetchOptions.onSuccess({} as any);
		}

		expect(clearSession).toHaveBeenCalled();
		expect(window.location.href).toBe("https://auth.test.com/login");
	});

	it("clears session and redirects even when signOut fails", async () => {
		vi.mocked(authClient.signOut).mockRejectedValue(new Error("Failed"));

		await logout();

		expect(clearSession).toHaveBeenCalled();
		expect(window.location.href).toBe("https://auth.test.com/login");
	});
});
