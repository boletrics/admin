import type { Meta, StoryObj } from "@storybook/react";
import { AdminDashboardOverview } from "@/components/admin/admin-dashboard-overview";
import { SWRConfig } from "swr";

const mockPlatformAnalytics = {
	total_revenue: 2500000,
	total_tickets_sold: 15000,
	total_organizations: 45,
	active_events: 120,
};

const mockOrganizations = {
	data: [
		{
			id: "1",
			name: "Rock Events Inc",
			status: "active",
			created_at: "2024-12-15",
		},
		{
			id: "2",
			name: "Sports Unlimited",
			status: "pending",
			created_at: "2025-01-10",
		},
	],
	total: 45,
};

const mockSystemHealth = {
	overall_status: "healthy",
	services: [
		{ name: "tickets-svc", status: "healthy" },
		{ name: "auth-svc", status: "healthy" },
	],
};

const mockSupportTickets = {
	data: [{ id: "1", subject: "Issue 1", status: "open", priority: "high" }],
	total: 12,
};

const meta: Meta<typeof AdminDashboardOverview> = {
	title: "Views/Admin/AdminDashboardOverview",
	component: AdminDashboardOverview,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<SWRConfig
				value={{
					fetcher: (key: string) => {
						if (key.includes("analytics"))
							return Promise.resolve(mockPlatformAnalytics);
						if (key.includes("organizations"))
							return Promise.resolve(mockOrganizations);
						if (key.includes("health"))
							return Promise.resolve(mockSystemHealth);
						if (key.includes("support"))
							return Promise.resolve(mockSupportTickets);
						return Promise.resolve({});
					},
					dedupingInterval: 0,
				}}
			>
				<div className="p-6 bg-background min-h-screen">
					<Story />
				</div>
			</SWRConfig>
		),
	],
};

export default meta;

type Story = StoryObj<typeof AdminDashboardOverview>;

export const Default: Story = {};

export const Loading: Story = {
	decorators: [
		(Story) => (
			<SWRConfig
				value={{
					fetcher: () => new Promise(() => {}),
					dedupingInterval: 0,
				}}
			>
				<div className="p-6 bg-background min-h-screen">
					<Story />
				</div>
			</SWRConfig>
		),
	],
};
