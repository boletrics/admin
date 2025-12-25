import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
	DEFAULT_TICKETS_SVC_URL,
	DEFAULT_API_BASE_URL,
	getTicketsSvcUrl,
	getUpstreamApiBaseUrl,
} from "./config";

describe("API Config", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		vi.resetModules();
		process.env = { ...originalEnv };
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	describe("DEFAULT_TICKETS_SVC_URL", () => {
		it("should be defined", () => {
			expect(DEFAULT_TICKETS_SVC_URL).toBeDefined();
			expect(typeof DEFAULT_TICKETS_SVC_URL).toBe("string");
		});
	});

	describe("DEFAULT_API_BASE_URL", () => {
		it("should be same as DEFAULT_TICKETS_SVC_URL", () => {
			expect(DEFAULT_API_BASE_URL).toBe(DEFAULT_TICKETS_SVC_URL);
		});
	});

	describe("getTicketsSvcUrl", () => {
		it("should return default URL when no env vars set", () => {
			delete process.env.TICKETS_SVC_URL;
			delete process.env.NEXT_PUBLIC_TICKETS_SVC_URL;

			expect(getTicketsSvcUrl()).toBe(DEFAULT_TICKETS_SVC_URL);
		});

		it("should prefer TICKETS_SVC_URL", () => {
			process.env.TICKETS_SVC_URL = "https://custom-svc.example.com";
			process.env.NEXT_PUBLIC_TICKETS_SVC_URL = "https://public.example.com";

			expect(getTicketsSvcUrl()).toBe("https://custom-svc.example.com");
		});

		it("should fallback to NEXT_PUBLIC_TICKETS_SVC_URL", () => {
			delete process.env.TICKETS_SVC_URL;
			process.env.NEXT_PUBLIC_TICKETS_SVC_URL = "https://public.example.com";

			expect(getTicketsSvcUrl()).toBe("https://public.example.com");
		});
	});

	describe("getUpstreamApiBaseUrl", () => {
		it("should return same as getTicketsSvcUrl", () => {
			expect(getUpstreamApiBaseUrl()).toBe(getTicketsSvcUrl());
		});
	});
});
