/**
 * Shared API types for tickets-svc and auth-svc integration.
 * These types match the backend OpenAPI schema.
 */

// ============================================================================
// Common Types
// ============================================================================

export interface ApiSuccessResponse<T> {
	success: true;
	result: T;
}

export interface ApiErrorResponse {
	success: false;
	errors: Array<{
		code: number;
		message: string;
	}>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedResult<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

// ============================================================================
// Organization Types (Platform Admin View)
// ============================================================================

export interface Organization {
	id: string;
	name: string;
	slug: string;
	logo_url?: string | null;
	description?: string | null;
	website?: string | null;
	email: string;
	phone?: string | null;
	tax_id?: string | null;
	status: "pending" | "active" | "suspended" | "inactive";
	plan: "starter" | "professional" | "enterprise";
	currency: "MXN" | "USD";
	timezone: string;
	language: "es" | "en";
	commission_rate: number;
	payout_schedule: "daily" | "weekly" | "biweekly" | "monthly";
	created_at: string;
	updated_at: string;
	// Admin-specific fields
	total_events?: number;
	total_revenue?: number;
	member_count?: number;
}

export interface UpdateOrganizationInput {
	status?: Organization["status"];
	plan?: Organization["plan"];
	commission_rate?: number;
}

// ============================================================================
// User Types (Platform Admin View)
// ============================================================================

export interface User {
	id: string;
	email: string;
	name?: string | null;
	image?: string | null;
	emailVerified: boolean;
	role?: string;
	banned?: boolean;
	banReason?: string | null;
	banExpiresAt?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface AdminUser {
	id: string;
	user_id: string;
	role: "super_admin" | "admin" | "support" | "viewer";
	status: "active" | "inactive";
	last_login_at?: string | null;
	created_at: string;
	updated_at: string;
	// Joined user data
	user?: User;
}

export interface UpdateUserInput {
	banned?: boolean;
	banReason?: string;
	banExpiresAt?: string;
	role?: string;
}

// ============================================================================
// Event Types
// ============================================================================

export type EventCategory =
	| "concert"
	| "sports"
	| "theater"
	| "festival"
	| "comedy"
	| "conference"
	| "exhibition";

export type EventStatus = "draft" | "published" | "cancelled" | "completed";

export interface Event {
	id: string;
	organization_id: string;
	venue_id: string;
	title: string;
	slug: string;
	description?: string | null;
	category: EventCategory;
	artist?: string | null;
	image_url?: string | null;
	status: EventStatus;
	published_at?: string | null;
	created_at: string;
	updated_at: string;
	// Relations
	organization?: Organization;
}

// ============================================================================
// Order Types
// ============================================================================

export type OrderStatus = "pending" | "paid" | "cancelled" | "refunded";

export interface Order {
	id: string;
	order_number: string;
	user_id?: string | null;
	email: string;
	event_id: string;
	organization_id: string;
	subtotal: number;
	fees: number;
	tax: number;
	total: number;
	currency: string;
	status: OrderStatus;
	payment_method?: string | null;
	payment_intent_id?: string | null;
	created_at: string;
	updated_at: string;
	paid_at?: string | null;
}

// ============================================================================
// Support Ticket Types
// ============================================================================

export type SupportTicketStatus =
	| "open"
	| "in_progress"
	| "waiting"
	| "resolved"
	| "closed";

export type SupportTicketPriority = "low" | "medium" | "high" | "critical";

export type SupportTicketCategory =
	| "billing"
	| "technical"
	| "account"
	| "feature"
	| "other";

export interface SupportTicket {
	id: string;
	organization_id?: string | null;
	user_id?: string | null;
	subject: string;
	description: string;
	status: SupportTicketStatus;
	priority: SupportTicketPriority;
	category: SupportTicketCategory;
	assignee_id?: string | null;
	created_at: string;
	updated_at: string;
	// Relations
	organization?: Organization;
	user?: User;
	assignee?: AdminUser;
	messages?: SupportTicketMessage[];
}

export interface SupportTicketMessage {
	id: string;
	ticket_id: string;
	author_id: string;
	author_role: "admin" | "user";
	content: string;
	created_at: string;
	// Relations
	author?: User;
}

export interface CreateSupportTicketInput {
	subject: string;
	description: string;
	priority?: SupportTicketPriority;
	category: SupportTicketCategory;
	organization_id?: string;
}

export interface UpdateSupportTicketInput {
	status?: SupportTicketStatus;
	priority?: SupportTicketPriority;
	assignee_id?: string;
}

export interface CreateSupportTicketMessageInput {
	content: string;
}

// ============================================================================
// Platform Analytics Types
// ============================================================================

export interface PlatformAnalytics {
	total_organizations: number;
	total_events: number;
	total_orders: number;
	total_revenue: number;
	total_users: number;
	organizations_by_status: Record<string, number>;
	organizations_by_plan: Record<string, number>;
	top_organizations: Array<{
		id: string;
		name: string;
		revenue: number;
		events: number;
	}>;
	revenue_by_period: Array<{
		date: string;
		revenue: number;
	}>;
	orders_by_period: Array<{
		date: string;
		orders: number;
	}>;
	growth_metrics: {
		organizations_growth: number;
		users_growth: number;
		revenue_growth: number;
	};
}

// ============================================================================
// System Health Types
// ============================================================================

export interface ServiceHealth {
	name: string;
	status: "healthy" | "degraded" | "down";
	latency_ms?: number;
	last_checked: string;
	message?: string;
}

export interface SystemHealth {
	overall_status: "healthy" | "degraded" | "down";
	services: ServiceHealth[];
	last_updated: string;
}

// ============================================================================
// Query Params Types
// ============================================================================

export interface OrganizationsQueryParams {
	status?: Organization["status"];
	plan?: Organization["plan"];
	search?: string;
	page?: number;
	limit?: number;
	[key: string]: string | number | boolean | undefined | null;
}

export interface UsersQueryParams {
	search?: string;
	role?: string;
	banned?: boolean;
	page?: number;
	limit?: number;
	[key: string]: string | number | boolean | undefined | null;
}

export interface SupportTicketsQueryParams {
	status?: SupportTicketStatus;
	priority?: SupportTicketPriority;
	category?: SupportTicketCategory;
	assignee_id?: string;
	organization_id?: string;
	page?: number;
	limit?: number;
	[key: string]: string | number | boolean | undefined | null;
}

export interface AnalyticsQueryParams {
	start_date?: string;
	end_date?: string;
	granularity?: "day" | "week" | "month";
	[key: string]: string | number | boolean | undefined | null;
}
