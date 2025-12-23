import type { Meta, StoryObj } from "@storybook/react";
import { AnalyticsOverviewPage } from "@/components/admin/analytics-overview-page";

const meta: Meta<typeof AnalyticsOverviewPage> = {
	title: "Views/Admin/AnalyticsOverviewPage",
	component: AnalyticsOverviewPage,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<div className="p-6 bg-background min-h-screen">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof AnalyticsOverviewPage>;

export const Default: Story = {};
