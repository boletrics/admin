import type { Meta, StoryObj } from "@storybook/react";
import { AccessControlPage } from "@/components/admin/access-control-page";

const meta: Meta<typeof AccessControlPage> = {
	title: "Views/Admin/AccessControlPage",
	component: AccessControlPage,
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

type Story = StoryObj<typeof AccessControlPage>;

export const Default: Story = {};
