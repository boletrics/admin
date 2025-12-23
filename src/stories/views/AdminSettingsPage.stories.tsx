import type { Meta, StoryObj } from "@storybook/react";
import { AdminSettingsPage } from "@/components/admin/admin-settings-page";

const meta: Meta<typeof AdminSettingsPage> = {
	title: "Views/Admin/AdminSettingsPage",
	component: AdminSettingsPage,
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

type Story = StoryObj<typeof AdminSettingsPage>;

export const Default: Story = {};
