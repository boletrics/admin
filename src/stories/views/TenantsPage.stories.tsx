import type { Meta, StoryObj } from "@storybook/react";
import { TenantsPage } from "@/components/admin/tenants-page";
import { SWRConfig } from "swr";

const mockOrganizations = [
	{
		id: "org-1",
		name: "Rock Events Inc",
		email: "contact@rockevents.com",
		status: "active" as const,
		plan: "professional" as const,
		total_events: 15,
		total_revenue: 250000,
		member_count: 5,
		created_at: "2024-06-15T10:00:00Z",
	},
	{
		id: "org-2",
		name: "Sports Unlimited",
		email: "info@sportsunlimited.com",
		status: "pending" as const,
		plan: "starter" as const,
		total_events: 0,
		total_revenue: 0,
		member_count: 2,
		created_at: "2025-01-10T14:30:00Z",
	},
	{
		id: "org-3",
		name: "Theater Productions",
		email: "admin@theater.com",
		status: "suspended" as const,
		plan: "enterprise" as const,
		total_events: 45,
		total_revenue: 890000,
		member_count: 12,
		created_at: "2023-03-20T09:00:00Z",
	},
];

const meta: Meta<typeof TenantsPage> = {
	title: "Views/Admin/TenantsPage",
	component: TenantsPage,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<SWRConfig
				value={{
					fetcher: () =>
						Promise.resolve({
							data: mockOrganizations,
							total: mockOrganizations.length,
						}),
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

type Story = StoryObj<typeof TenantsPage>;

export const Default: Story = {};

export const Empty: Story = {
	decorators: [
		(Story) => (
			<SWRConfig
				value={{
					fetcher: () => Promise.resolve({ data: [], total: 0 }),
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
