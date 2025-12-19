"use client";

import { useThemeEffect } from "@/hooks/use-theme";
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout";
import { NotificationsSettingsPage } from "@/components/admin/notifications-settings-page";

export default function NotificationsRoutePage() {
	useThemeEffect();

	return (
		<AdminDashboardLayout>
			<NotificationsSettingsPage />
		</AdminDashboardLayout>
	);
}
