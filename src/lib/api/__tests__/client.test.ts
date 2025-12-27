import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
	fetcher,
	buildQueryString,
	getAuthToken,
	apiFetch,
	ApiError,
} from "../client";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock auth
vi.mock("../../auth/authClient", () => ({
	getClientJwt: vi.fn().mockResolvedValue(null),
}));

describe("Admin API Client", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("ApiError", () => {
		it("should correctly identify ApiError instances", () => {
			const apiError = new ApiError("Test error", {
				status: 400,
				code: 400,
				body: {},
			});

			expect(ApiError.isApiError(apiError)).toBe(true);
			expect(ApiError.isApiError(new Error("Regular error"))).toBe(false);
			expect(ApiError.isApiError(null)).toBe(false);
			expect(ApiError.isApiError(undefined)).toBe(false);
			expect(ApiError.isApiError("string")).toBe(false);
		});

		it("should set properties correctly", () => {
			const apiError = new ApiError("Test message", {
				status: 404,
				code: 1001,
				body: { detail: "Not found" },
			});

			expect(apiError.name).toBe("ApiError");
			expect(apiError.message).toBe("Test message");
			expect(apiError.status).toBe(404);
			expect(apiError.code).toBe(1001);
			expect(apiError.body).toEqual({ detail: "Not found" });
		});
	});

	describe("fetcher", () => {
		it("should call fetch with the correct URL", async () => {
			const mockResponse = { data: "test" };
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: {
					get: () => "application/json",
				},
				json: async () => mockResponse,
			});

			const result = await fetcher("/test-endpoint");

			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("/test-endpoint"),
				expect.objectContaining({
					headers: expect.any(Object),
				}),
			);
			expect(result).toEqual(mockResponse);
		});

		it("should throw an error when response is not ok", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				headers: {
					get: () => "application/json",
				},
				json: async () => ({
					errors: [{ message: "Server error", code: 500 }],
				}),
			});

			await expect(fetcher("/test-endpoint")).rejects.toThrow();
		});

		it("should include Accept header", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: {
					get: () => "application/json",
				},
				json: async () => ({}),
			});

			await fetcher("/test-endpoint");

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						Accept: "application/json",
					}),
				}),
			);
		});
	});

	describe("buildQueryString", () => {
		it("should return empty string for empty params", () => {
			expect(buildQueryString({})).toBe("");
		});

		it("should build query string from params", () => {
			const result = buildQueryString({
				page: 1,
				limit: 10,
				search: "test",
			});

			expect(result).toBe("?page=1&limit=10&search=test");
		});

		it("should skip undefined and null values", () => {
			const result = buildQueryString({
				page: 1,
				limit: undefined,
				search: null,
			});

			expect(result).toBe("?page=1");
		});
	});

	describe("getAuthToken", () => {
		it("should return null when no token is stored", () => {
			expect(getAuthToken()).toBeNull();
		});
	});

	describe("apiFetch", () => {
		it("should add JWT to Authorization header when provided", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: {
					get: () => "application/json",
				},
				json: async () => ({ data: "test" }),
			});

			await apiFetch("/test-endpoint", { jwt: "test-jwt-token" });

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: "Bearer test-jwt-token",
					}),
				}),
			);
		});

		it("should unwrap success response with result property", async () => {
			const wrappedResponse = {
				success: true,
				result: { id: "123", name: "Test" },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: {
					get: () => "application/json",
				},
				json: async () => wrappedResponse,
			});

			const result = await apiFetch("/test-endpoint");

			expect(result).toEqual({ id: "123", name: "Test" });
		});

		it("should return plain response when not wrapped", async () => {
			const plainResponse = { id: "123", name: "Test" };
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: {
					get: () => "application/json",
				},
				json: async () => plainResponse,
			});

			const result = await apiFetch("/test-endpoint");

			expect(result).toEqual(plainResponse);
		});

		it("should handle non-JSON error responses", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				headers: {
					get: () => "text/plain",
				},
				text: async () => "Internal Server Error",
			});

			await expect(apiFetch("/test-endpoint")).rejects.toThrow(
				"Request failed: 500",
			);
		});

		it("should extract error message from API error response", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 400,
				headers: {
					get: () => "application/json",
				},
				json: async () => ({
					success: false,
					errors: [{ message: "Validation failed", code: 400 }],
				}),
			});

			await expect(apiFetch("/test-endpoint")).rejects.toThrow(
				"Validation failed",
			);
		});

		it("should handle error response without errors array", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
				headers: {
					get: () => "application/json",
				},
				json: async () => ({ error: "Not found" }),
			});

			await expect(apiFetch("/test-endpoint")).rejects.toThrow(
				"Request failed: 404",
			);
		});

		it("should route auth endpoints to auth service", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: {
					get: () => "application/json",
				},
				json: async () => ({ user: "test" }),
			});

			await apiFetch("/api/auth/session");

			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("/api/auth/session"),
				expect.any(Object),
			);
		});

		it("should route admin endpoints to local Next.js API", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: {
					get: () => "application/json",
				},
				json: async () => ({ data: [] }),
			});

			await apiFetch("/admin/organizations");

			expect(mockFetch).toHaveBeenCalledWith(
				"/api/admin/organizations",
				expect.any(Object),
			);
		});

		it("should keep already-prefixed /api/admin/ endpoints as relative URLs", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: {
					get: () => "application/json",
				},
				json: async () => ({ data: [] }),
			});

			await apiFetch("/api/admin/organizations");

			expect(mockFetch).toHaveBeenCalledWith(
				"/api/admin/organizations",
				expect.any(Object),
			);
		});

		it("should use full URL when endpoint is absolute", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: {
					get: () => "application/json",
				},
				json: async () => ({ data: "test" }),
			});

			await apiFetch("https://example.com/api/test");

			expect(mockFetch).toHaveBeenCalledWith(
				"https://example.com/api/test",
				expect.any(Object),
			);
		});

		it("should stringify object body and set Content-Type", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: {
					get: () => "application/json",
				},
				json: async () => ({ id: "created" }),
			});

			await apiFetch("/test-endpoint", {
				method: "POST",
				body: { name: "Test" } as unknown as BodyInit,
			});

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						"Content-Type": "application/json",
					}),
					body: JSON.stringify({ name: "Test" }),
				}),
			);
		});

		it("should route nested admin endpoints to local Next.js API", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: {
					get: () => "application/json",
				},
				json: async () => ({ data: {} }),
			});

			await apiFetch("/admin/organizations/123");

			expect(mockFetch).toHaveBeenCalledWith(
				"/api/admin/organizations/123",
				expect.any(Object),
			);
		});

		it("should not stringify FormData body", async () => {
			const formData = new FormData();
			formData.append("file", "test");

			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: {
					get: () => "application/json",
				},
				json: async () => ({ uploaded: true }),
			});

			await apiFetch("/upload", {
				method: "POST",
				body: formData,
			});

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					body: formData,
				}),
			);
		});
	});
});
