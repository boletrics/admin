"use client";

import { useApiQuery } from "../client";
import type { SystemHealth } from "../types";

// ============================================================================
// System Health Hooks
// ============================================================================

/**
 * Fetch system health status.
 * Polls every 30 seconds by default.
 */
export function useSystemHealth(options?: { refreshInterval?: number }) {
	return useApiQuery<SystemHealth>("/health/system", {
		refreshInterval: options?.refreshInterval ?? 30000,
		revalidateOnFocus: true,
	});
}

/**
 * Fetch tickets-svc health.
 */
export function useTicketsSvcHealth() {
	return useApiQuery<{ ok: boolean; latency_ms?: number }>("/healthz", {
		refreshInterval: 30000,
	});
}

/**
 * Fetch auth-svc health.
 */
export function useAuthSvcHealth() {
	return useApiQuery<{ ok: boolean; latency_ms?: number }>("/api/auth/health", {
		refreshInterval: 30000,
	});
}

// ============================================================================
// Infrastructure Metrics
// ============================================================================

export interface InfraMetrics {
	api: {
		requests_per_minute: number;
		average_latency_ms: number;
		error_rate: number;
		status: "healthy" | "degraded" | "down";
	};
	database: {
		connections: number;
		queries_per_minute: number;
		average_query_time_ms: number;
		status: "healthy" | "degraded" | "down";
	};
	cdn: {
		hit_rate: number;
		bandwidth_gb: number;
		requests_per_minute: number;
		status: "healthy" | "degraded" | "down";
	};
}

export function useInfraMetrics() {
	return useApiQuery<InfraMetrics>("/health/infra", {
		refreshInterval: 60000, // 1 minute
	});
}

// ============================================================================
// Activity Log
// ============================================================================

export interface ActivityLogEntry {
	id: string;
	timestamp: string;
	actor_id: string;
	actor_email?: string;
	action: string;
	resource_type: string;
	resource_id?: string;
	details?: Record<string, unknown>;
	ip_address?: string;
}

export interface ActivityLogParams {
	actor_id?: string;
	action?: string;
	resource_type?: string;
	start_date?: string;
	end_date?: string;
	page?: number;
	limit?: number;
}

export function useActivityLog(params: ActivityLogParams = {}) {
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			searchParams.append(key, String(value));
		}
	});
	const queryString = searchParams.toString();

	return useApiQuery<{
		data: ActivityLogEntry[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
		};
	}>(`/activity-log${queryString ? `?${queryString}` : ""}`);
}
