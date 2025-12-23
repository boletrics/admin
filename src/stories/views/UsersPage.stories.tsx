import type { Meta, StoryObj } from "@storybook/react";
import { UsersPage } from "@/components/admin/users-page";

const meta: Meta<typeof UsersPage> = {
	title: "Views/Admin/UsersPage",
	component: UsersPage,
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

type Story = StoryObj<typeof UsersPage>;

export const Default: Story = {};
