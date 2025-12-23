import type { Meta, StoryObj } from "@storybook/react";
import { RegionsPage } from "@/components/admin/regions-page";

const meta: Meta<typeof RegionsPage> = {
	title: "Views/Admin/RegionsPage",
	component: RegionsPage,
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

type Story = StoryObj<typeof RegionsPage>;

export const Default: Story = {};
