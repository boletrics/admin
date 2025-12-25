"use client";

import { useApiQuery, buildQueryString } from "../client";
import type { PlatformAnalytics, AnalyticsQueryParams } from "../types";

// ============================================================================
// Platform Analytics Hooks
// ============================================================================

/**
 * Fetch platform-wide analytics.
 */
export function usePlatformAnalytics(params: AnalyticsQueryParams = {}) {
	const queryString = buildQueryString(params);
	return useApiQuery<PlatformAnalytics>(`/analytics/platform${queryString}`);
}

/**
 * Fetch revenue analytics (platform-wide).
 */
export function usePlatformRevenueAnalytics(params: AnalyticsQueryParams = {}) {
	const queryString = buildQueryString(params);
	return useApiQuery<{
		total_revenue: number;
		platform_fees: number;
		organization_payouts: number;
		revenue_by_period: Array<{
			date: string;
			total: number;
			fees: number;
			payouts: number;
		}>;
		top_organizations: Array<{
			id: string;
			name: string;
			revenue: number;
		}>;
	}>(`/analytics/platform/revenue${queryString}`);
}

/**
 * Fetch growth analytics.
 */
export function useGrowthAnalytics(params: AnalyticsQueryParams = {}) {
	const queryString = buildQueryString(params);
	return useApiQuery<{
		organizations: {
			current: number;
			previous: number;
			growth_rate: number;
		};
		users: {
			current: number;
			previous: number;
			growth_rate: number;
		};
		events: {
			current: number;
			previous: number;
			growth_rate: number;
		};
		revenue: {
			current: number;
			previous: number;
			growth_rate: number;
		};
		growth_by_period: Array<{
			date: string;
			organizations: number;
			users: number;
			events: number;
			revenue: number;
		}>;
	}>(`/analytics/platform/growth${queryString}`);
}

/**
 * Fetch event analytics (platform-wide).
 */
export function usePlatformEventAnalytics(params: AnalyticsQueryParams = {}) {
	const queryString = buildQueryString(params);
	return useApiQuery<{
		total_events: number;
		published_events: number;
		total_tickets_sold: number;
		events_by_category: Record<string, number>;
		events_by_region: Record<string, number>;
		top_events: Array<{
			id: string;
			title: string;
			organization_name: string;
			tickets_sold: number;
			revenue: number;
		}>;
	}>(`/analytics/platform/events${queryString}`);
}
