import { describe, expect, it } from "vitest";
import { getAuthCoreBaseUrl, getAuthAppUrl } from "./config";

describe("auth/config", () => {
	it("uses NEXT_PUBLIC_AUTH_SERVICE_URL when set", () => {
		const prev = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

		try {
			process.env.NEXT_PUBLIC_AUTH_SERVICE_URL = "https://custom-auth-svc.example.com";
			expect(getAuthCoreBaseUrl()).toBe("https://custom-auth-svc.example.com");
		} finally {
			if (prev === undefined)
				delete process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;
			else process.env.NEXT_PUBLIC_AUTH_SERVICE_URL = prev;
		}
	});

	it("falls back to default when NEXT_PUBLIC_AUTH_SERVICE_URL is unset", () => {
		const prev = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

		try {
			delete process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;
			expect(getAuthCoreBaseUrl()).toBe("https://auth-svc.example.workers.dev");
		} finally {
			if (prev === undefined)
				delete process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;
			else process.env.NEXT_PUBLIC_AUTH_SERVICE_URL = prev;
		}
	});

	it("uses NEXT_PUBLIC_AUTH_APP_URL when set", () => {
		const prev = process.env.NEXT_PUBLIC_AUTH_APP_URL;

		try {
			process.env.NEXT_PUBLIC_AUTH_APP_URL = "https://custom-auth.example.com";
			expect(getAuthAppUrl()).toBe("https://custom-auth.example.com");
		} finally {
			if (prev === undefined) delete process.env.NEXT_PUBLIC_AUTH_APP_URL;
			else process.env.NEXT_PUBLIC_AUTH_APP_URL = prev;
		}
	});

	it("falls back to default when NEXT_PUBLIC_AUTH_APP_URL is unset", () => {
		const prev = process.env.NEXT_PUBLIC_AUTH_APP_URL;

		try {
			delete process.env.NEXT_PUBLIC_AUTH_APP_URL;
			expect(getAuthAppUrl()).toBe("https://auth.example.workers.dev");
		} finally {
			if (prev === undefined) delete process.env.NEXT_PUBLIC_AUTH_APP_URL;
			else process.env.NEXT_PUBLIC_AUTH_APP_URL = prev;
		}
	});
});
