"use client";

import { useThemeEffect } from "@/hooks/use-theme";
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout";
import { GrowthAnalyticsPage } from "@/components/admin/growth-analytics-page";

export default function GrowthAnalyticsRoutePage() {
	useThemeEffect();

	return (
		<AdminDashboardLayout>
			<GrowthAnalyticsPage />
		</AdminDashboardLayout>
	);
}
