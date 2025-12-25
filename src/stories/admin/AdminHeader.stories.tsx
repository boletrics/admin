import type { Meta, StoryObj } from "@storybook/react";
import { AdminHeader } from "@/components/admin/admin-header";
import { SidebarProvider } from "@/components/ui/sidebar";

const meta: Meta<typeof AdminHeader> = {
	title: "Blocks/Admin/AdminHeader",
	component: AdminHeader,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<SidebarProvider>
				<div className="min-h-[100px]">
					<Story />
				</div>
			</SidebarProvider>
		),
	],
};

export default meta;

type Story = StoryObj<typeof AdminHeader>;

export const Default: Story = {};
