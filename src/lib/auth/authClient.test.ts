import { describe, expect, it } from "vitest";
import { authClient } from "./authClient";

describe("auth/authClient", () => {
	it("creates auth client instance", () => {
		expect(authClient).toBeDefined();
		// authClient is created by better-auth, we just verify it exists
		expect(authClient).toBeTruthy();
	});
});
