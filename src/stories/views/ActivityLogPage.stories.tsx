import type { Meta, StoryObj } from "@storybook/react";
import { ActivityLogPage } from "@/components/admin/activity-log-page";

const meta: Meta<typeof ActivityLogPage> = {
	title: "Views/Admin/ActivityLogPage",
	component: ActivityLogPage,
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

type Story = StoryObj<typeof ActivityLogPage>;

export const Default: Story = {};
