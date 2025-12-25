import type { Meta, StoryObj } from "@storybook/react";
import { SupportTicketsPage } from "@/components/admin/support-tickets-page";
import { SWRConfig } from "swr";

const mockTickets = [
	{
		id: "ticket-1",
		subject: "Payment not processing",
		description: "Unable to complete checkout",
		status: "open" as const,
		priority: "high" as const,
		user_email: "customer@example.com",
		created_at: "2025-01-15T10:00:00Z",
		updated_at: "2025-01-15T12:00:00Z",
	},
	{
		id: "ticket-2",
		subject: "Refund request",
		description: "Event was cancelled",
		status: "in_progress" as const,
		priority: "medium" as const,
		user_email: "user@example.com",
		created_at: "2025-01-14T09:00:00Z",
		updated_at: "2025-01-15T08:00:00Z",
	},
	{
		id: "ticket-3",
		subject: "Account access issue",
		description: "Cannot login to my account",
		status: "resolved" as const,
		priority: "low" as const,
		user_email: "help@example.com",
		created_at: "2025-01-10T15:00:00Z",
		updated_at: "2025-01-12T11:00:00Z",
	},
];

const meta: Meta<typeof SupportTicketsPage> = {
	title: "Views/Admin/SupportTicketsPage",
	component: SupportTicketsPage,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<SWRConfig
				value={{
					fetcher: () =>
						Promise.resolve({ data: mockTickets, total: mockTickets.length }),
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

type Story = StoryObj<typeof SupportTicketsPage>;

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
