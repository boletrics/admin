"use client";

import { useThemeEffect } from "@/hooks/use-theme";
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout";
import { SupportTicketsPage } from "@/components/admin/support-tickets-page";

export default function TicketsPage() {
	useThemeEffect();

	return (
		<AdminDashboardLayout>
			<SupportTicketsPage />
		</AdminDashboardLayout>
	);
}
