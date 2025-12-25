import type { Meta, StoryObj } from "@storybook/react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const meta: Meta<typeof AdminSidebar> = {
	title: "Blocks/Admin/AdminSidebar",
	component: AdminSidebar,
	parameters: {
		layout: "fullscreen",
		nextjs: {
			appDirectory: true,
			navigation: {
				pathname: "/admin",
			},
		},
	},
	decorators: [
		(Story) => (
			<SidebarProvider defaultOpen>
				<div className="flex min-h-screen">
					<Story />
				</div>
			</SidebarProvider>
		),
	],
};

export default meta;

type Story = StoryObj<typeof AdminSidebar>;

export const Default: Story = {};

export const Collapsed: Story = {
	decorators: [
		(Story) => (
			<SidebarProvider defaultOpen={false}>
				<div className="flex min-h-screen">
					<Story />
				</div>
			</SidebarProvider>
		),
	],
};
