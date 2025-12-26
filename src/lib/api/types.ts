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

/**
 * Organization identity (from auth-svc).
 * This is the source of truth for organization name, slug, logo, and membership.
 */
export interface Organization {
	id: string;
	name: string;
	slug: string;
	logo?: string | null;
	metadata?: Record<string, unknown> | null;
	createdAt: string;
	// Admin-specific aggregated fields
	total_events?: number;
	total_revenue?: number;
	member_count?: number;
}

/**
 * Organization settings (from tickets-svc).
 * Ticketing-specific configuration like plan, commission, payout schedule.
 */
export interface OrganizationSettings {
	org_id: string;
	email: string;
	phone?: string | null;
	tax_id?: string | null;
	description?: string | null;
	website?: string | null;
	status: "pending" | "active" | "suspended" | "inactive";
	plan: "starter" | "professional" | "enterprise";
	currency: "MXN" | "USD";
	timezone: string;
	language: "es" | "en";
	commission_rate: number;
	payout_schedule: "daily" | "weekly" | "biweekly" | "monthly";
	created_at: string;
	updated_at: string;
}

/**
 * Combined organization with both identity and settings.
 * Used in admin dashboard views where both are needed.
 */
export interface OrganizationWithSettings extends Organization {
	settings?: OrganizationSettings;
}

export interface UpdateOrganizationSettingsInput {
	status?: OrganizationSettings["status"];
	plan?: OrganizationSettings["plan"];
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
// Venue Types
// ============================================================================

export interface Venue {
	id: string;
	name: string;
	address: string;
	city: string;
	state: string;
	postal_code?: string | null;
	country: string;
	region: "mexico-city" | "monterrey" | "guadalajara" | "cancun";
	capacity?: number | null;
	latitude?: number | null;
	longitude?: number | null;
	created_at: string;
	updated_at: string;
}

export interface CreateVenueInput {
	name: string;
	address: string;
	city: string;
	state: string;
	postal_code?: string;
	country: string;
	region: Venue["region"];
	capacity?: number;
	latitude?: number;
	longitude?: number;
}

export interface UpdateVenueInput extends Partial<CreateVenueInput> {}

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

export interface EventDate {
	id: string;
	event_id: string;
	date: string;
	start_time: string;
	end_time?: string | null;
	created_at: string;
	updated_at: string;
}

export interface TicketType {
	id: string;
	event_id: string;
	name: string;
	description?: string | null;
	price: number;
	quantity_total: number;
	quantity_sold: number;
	quantity_available: number;
	sales_start_at?: string | null;
	sales_end_at?: string | null;
	status: "active" | "sold_out" | "cancelled";
	created_at: string;
	updated_at: string;
}

export interface Event {
	id: string;
	org_id: string; // References auth-svc organization.id
	venue_id: string;
	title: string;
	slug: string;
	description?: string | null;
	category: EventCategory;
	artist?: string | null;
	image_url?: string | null;
	image_blur?: string | null; // Base64 blur placeholder for Next.js blurDataURL
	status: EventStatus;
	published_at?: string | null;
	created_at: string;
	updated_at: string;
	// Relations (optional, included with ?include=)
	venue?: Venue;
	dates?: EventDate[];
	ticket_types?: TicketType[];
	organization?: Organization;
}

export interface CreateEventInput {
	org_id: string; // References auth-svc organization.id
	venue_id: string;
	title: string;
	slug: string;
	description?: string;
	category: EventCategory;
	artist?: string;
	image_url?: string;
	image_blur?: string; // Base64 blur placeholder for Next.js blurDataURL
	status?: EventStatus;
	published_at?: string;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {}

export interface CreateEventDateInput {
	event_id: string;
	date: string;
	start_time: string;
	end_time?: string;
}

export interface UpdateEventDateInput extends Partial<
	Omit<CreateEventDateInput, "event_id">
> {}

export interface CreateTicketTypeInput {
	event_id: string;
	name: string;
	description?: string;
	price: number;
	quantity_total: number;
	sales_start_at?: string;
	sales_end_at?: string;
}

export interface UpdateTicketTypeInput extends Partial<
	Omit<CreateTicketTypeInput, "event_id">
> {}

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
	org_id: string; // References auth-svc organization.id
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
	org_id?: string | null; // References auth-svc organization.id
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
	org_id?: string; // References auth-svc organization.id
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
	status?: OrganizationSettings["status"];
	plan?: OrganizationSettings["plan"];
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
	org_id?: string; // References auth-svc organization.id
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

export interface EventsQueryParams {
	org_id?: string;
	status?: EventStatus;
	category?: EventCategory;
	region?: string;
	search?: string;
	page?: number;
	limit?: number;
	include?: string;
	[key: string]: string | number | boolean | undefined | null;
}

export interface VenuesQueryParams {
	region?: string;
	city?: string;
	search?: string;
	page?: number;
	limit?: number;
	[key: string]: string | number | boolean | undefined | null;
}
