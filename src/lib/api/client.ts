"use client";

import useSWR, { SWRConfiguration, mutate as globalMutate } from "swr";
import useSWRMutation from "swr/mutation";
import { getClientJwt } from "../auth/authClient";
import { getTicketsSvcUrl } from "./config";
import { getAuthServiceUrl } from "../auth/config";
import type { ApiResponse, ApiSuccessResponse } from "./types";

// ============================================================================
// API Error Handling
// ============================================================================

export class ApiError extends Error {
	name = "ApiError" as const;
	status: number;
	code?: number;
	body: unknown;

	constructor(
		message: string,
		opts: { status: number; code?: number; body: unknown },
	) {
		super(message);
		this.status = opts.status;
		this.code = opts.code;
		this.body = opts.body;
	}

	static isApiError(error: unknown): error is ApiError {
		return error instanceof ApiError;
	}
}

// ============================================================================
// Base Fetcher with JWT
// ============================================================================

export type FetcherOptions = RequestInit & {
	jwt?: string | null;
};

/**
 * Low-level fetch wrapper with JWT injection.
 */
export async function apiFetch<T>(
	endpoint: string,
	options: FetcherOptions = {},
): Promise<T> {
	const { jwt, ...fetchOptions } = options;

	const headers: Record<string, string> = {
		Accept: "application/json",
		...(fetchOptions.headers as Record<string, string>),
	};

	const token = jwt ?? (await getClientJwt());
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	if (
		fetchOptions.body &&
		typeof fetchOptions.body === "object" &&
		!(fetchOptions.body instanceof FormData)
	) {
		headers["Content-Type"] = "application/json";
		fetchOptions.body = JSON.stringify(fetchOptions.body);
	}

	// Determine base URL based on endpoint prefix
	let url: string;
	if (endpoint.startsWith("http")) {
		url = endpoint;
	} else if (endpoint.startsWith("/api/auth/")) {
		// Auth service endpoints
		url = `${getAuthServiceUrl()}${endpoint}`;
	} else {
		// Tickets service endpoints
		url = `${getTicketsSvcUrl()}${endpoint}`;
	}

	const response = await fetch(url, {
		...fetchOptions,
		headers,
	});

	const contentType = response.headers.get("content-type") ?? "";
	const isJson = contentType.includes("application/json");
	const body = isJson ? await response.json() : await response.text();

	if (!response.ok) {
		const errorBody = body as ApiResponse<unknown>;
		const message =
			!isJson || typeof body === "string"
				? `Request failed: ${response.status}`
				: "errors" in errorBody && errorBody.errors?.[0]?.message
					? errorBody.errors[0].message
					: `Request failed: ${response.status}`;

		throw new ApiError(message, {
			status: response.status,
			code:
				isJson && "errors" in errorBody
					? errorBody.errors?.[0]?.code
					: undefined,
			body,
		});
	}

	if (isJson && typeof body === "object" && body !== null) {
		const apiResponse = body as ApiResponse<T>;
		if (
			"success" in apiResponse &&
			apiResponse.success &&
			"result" in apiResponse
		) {
			return (apiResponse as ApiSuccessResponse<T>).result;
		}
	}

	return body as T;
}

/**
 * SWR fetcher function.
 */
export const swrFetcher = async <T>(url: string): Promise<T> => {
	return apiFetch<T>(url);
};

// ============================================================================
// SWR Configuration
// ============================================================================

export const defaultSwrConfig: SWRConfiguration = {
	fetcher: swrFetcher,
	revalidateOnFocus: true,
	revalidateOnReconnect: true,
	shouldRetryOnError: true,
	errorRetryCount: 3,
	dedupingInterval: 2000,
};

// ============================================================================
// Generic SWR Hooks (requires React context - integration tested)
// ============================================================================

/* v8 ignore start */

/**
 * Generic hook for GET requests with SWR.
 */
export function useApiQuery<T>(
	endpoint: string | null,
	config?: SWRConfiguration<T>,
) {
	let url: string | null = null;
	if (endpoint) {
		if (endpoint.startsWith("http")) {
			url = endpoint;
		} else if (endpoint.startsWith("/api/auth/")) {
			url = `${getAuthServiceUrl()}${endpoint}`;
		} else {
			url = `${getTicketsSvcUrl()}${endpoint}`;
		}
	}

	return useSWR<T, ApiError>(url, {
		...defaultSwrConfig,
		...config,
	});
}

/**
 * Generic hook for mutations.
 */
export function useApiMutation<TData, TArg = unknown>(
	endpoint: string,
	method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
) {
	let url: string;
	if (endpoint.startsWith("http")) {
		url = endpoint;
	} else if (endpoint.startsWith("/api/auth/")) {
		url = `${getAuthServiceUrl()}${endpoint}`;
	} else {
		url = `${getTicketsSvcUrl()}${endpoint}`;
	}

	return useSWRMutation<TData, ApiError, string, TArg>(
		url,
		async (key: string, { arg }: { arg: TArg }) => {
			return apiFetch<TData>(key, {
				method,
				body: arg as unknown as BodyInit,
			});
		},
	);
}

// ============================================================================
// Mutation Helpers
// ============================================================================

export function revalidate(key: string | RegExp) {
	if (typeof key === "string") {
		let url: string;
		if (key.startsWith("http")) {
			url = key;
		} else if (key.startsWith("/api/auth/")) {
			url = `${getAuthServiceUrl()}${key}`;
		} else {
			url = `${getTicketsSvcUrl()}${key}`;
		}
		globalMutate(url);
	} else {
		globalMutate((k) => typeof k === "string" && key.test(k));
	}
}

export async function optimisticUpdate<T>(
	key: string,
	updateFn: (current: T | undefined) => T,
	revalidateAfter = true,
) {
	let url: string;
	if (key.startsWith("http")) {
		url = key;
	} else if (key.startsWith("/api/auth/")) {
		url = `${getAuthServiceUrl()}${key}`;
	} else {
		url = `${getTicketsSvcUrl()}${key}`;
	}
	await globalMutate(url, updateFn, { revalidate: revalidateAfter });
}

/* v8 ignore stop */

// ============================================================================
// Query String Helpers
// ============================================================================

export function buildQueryString(
	params: Record<string, string | number | boolean | undefined | null>,
): string {
	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") {
			searchParams.append(key, String(value));
		}
	});

	const queryString = searchParams.toString();
	return queryString ? `?${queryString}` : "";
}

// ============================================================================
// Re-exports for convenience
// ============================================================================

/**
 * SWR fetcher function - alias for backwards compatibility.
 */
export const fetcher = swrFetcher;

/**
 * Get the current auth token (for testing).
 */
export function getAuthToken(): string | null {
	// This would be implemented based on your auth setup
	return null;
}
