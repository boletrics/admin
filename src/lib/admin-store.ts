"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// System Health Types
export interface SystemHealth {
	status: "healthy" | "degraded" | "critical";
	uptime: number; // percentage
	lastChecked: string;
	services: ServiceStatus[];
}

export interface ServiceStatus {
	id: string;
	name: string;
	status: "operational" | "degraded" | "down";
	latency: number; // ms
	lastIncident?: string;
}

// Tenant/Organization Types
export interface Tenant {
	id: string;
	name: string;
	slug: string;
	email: string;
	plan: "free" | "starter" | "professional" | "enterprise";
	status: "active" | "suspended" | "pending" | "churned";
	mrr: number; // Monthly Recurring Revenue
	usersCount: number;
	eventsCount: number;
	createdAt: string;
	lastActiveAt: string;
	region: string;
}

// Support Ticket Types
export interface SupportTicket {
	id: string;
	subject: string;
	description: string;
	status: "open" | "in-progress" | "waiting" | "resolved" | "closed";
	priority: "low" | "medium" | "high" | "critical";
	category: "billing" | "technical" | "account" | "feature" | "other";
	tenantId: string;
	tenantName: string;
	assigneeId?: string;
	assigneeName?: string;
	createdAt: string;
	updatedAt: string;
	messages: TicketMessage[];
}

export interface TicketMessage {
	id: string;
	content: string;
	authorId: string;
	authorName: string;
	authorRole: "admin" | "user";
	createdAt: string;
}

// User Activity Types
export interface UserActivity {
	id: string;
	userId: string;
	userName: string;
	userEmail: string;
	tenantId: string;
	tenantName: string;
	action: string;
	details: string;
	ipAddress: string;
	userAgent: string;
	timestamp: string;
}

// Admin User Types
export interface AdminUser {
	id: string;
	name: string;
	email: string;
	role: "super_admin" | "admin" | "support" | "viewer";
	avatar?: string;
	lastLoginAt: string;
	status: "active" | "inactive";
}

// Platform Stats
export interface PlatformStats {
	totalTenants: number;
	activeTenants: number;
	totalUsers: number;
	totalMRR: number;
	totalRevenue: number;
	openTickets: number;
	avgResponseTime: number; // hours
	uptime: number; // percentage
}

export type AdminView =
	| "dashboard"
	| "health"
	| "activity"
	| "tenants"
	| "tenants-pending"
	| "tenants-suspended"
	| "users"
	| "tickets"
	| "analytics"
	| "analytics-revenue"
	| "analytics-growth"
	| "infra-database"
	| "infra-cdn"
	| "infra-api"
	| "settings"
	| "access"
	| "notifications"
	| "regions";

// Admin Store
interface AdminStore {
	currentAdmin: AdminUser | null;
	systemHealth: SystemHealth | null;
	platformStats: PlatformStats | null;
	currentView: AdminView;
	setCurrentAdmin: (admin: AdminUser | null) => void;
	setSystemHealth: (health: SystemHealth) => void;
	setPlatformStats: (stats: PlatformStats) => void;
	setCurrentView: (view: AdminView) => void;
}

export const useAdminStore = create<AdminStore>()(
	persist(
		(set) => ({
			currentAdmin: null,
			systemHealth: null,
			platformStats: null,
			currentView: "dashboard",
			setCurrentAdmin: (admin) => set({ currentAdmin: admin }),
			setSystemHealth: (health) => set({ systemHealth: health }),
			setPlatformStats: (stats) => set({ platformStats: stats }),
			setCurrentView: (view) => set({ currentView: view }),
		}),
		{
			name: "admin-storage",
			skipHydration: true,
		},
	),
);
