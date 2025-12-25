import type { Meta, StoryObj } from "@storybook/react";
import { SystemHealthPage } from "@/components/admin/system-health-page";
import { SWRConfig } from "swr";

const mockHealthData = {
	overall_status: "healthy" as const,
	last_updated: new Date().toISOString(),
	services: [
		{
			name: "tickets-svc",
			status: "healthy" as const,
			latency_ms: 45,
			uptime_percent: 99.9,
		},
		{
			name: "auth-svc",
			status: "healthy" as const,
			latency_ms: 32,
			uptime_percent: 99.99,
		},
		{
			name: "Database",
			status: "healthy" as const,
			latency_ms: 12,
			uptime_percent: 99.95,
		},
		{
			name: "CDN",
			status: "healthy" as const,
			latency_ms: 8,
			uptime_percent: 100,
		},
	],
};

const mockDegradedHealth = {
	overall_status: "degraded" as const,
	last_updated: new Date().toISOString(),
	services: [
		{
			name: "tickets-svc",
			status: "degraded" as const,
			latency_ms: 450,
			uptime_percent: 98.5,
		},
		{
			name: "auth-svc",
			status: "healthy" as const,
			latency_ms: 32,
			uptime_percent: 99.99,
		},
		{
			name: "Database",
			status: "healthy" as const,
			latency_ms: 12,
			uptime_percent: 99.95,
		},
		{
			name: "CDN",
			status: "healthy" as const,
			latency_ms: 8,
			uptime_percent: 100,
		},
	],
};

const meta: Meta<typeof SystemHealthPage> = {
	title: "Views/Admin/SystemHealthPage",
	component: SystemHealthPage,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<SWRConfig
				value={{
					fetcher: () => Promise.resolve(mockHealthData),
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

type Story = StoryObj<typeof SystemHealthPage>;

export const AllHealthy: Story = {};

export const Degraded: Story = {
	decorators: [
		(Story) => (
			<SWRConfig
				value={{
					fetcher: () => Promise.resolve(mockDegradedHealth),
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
