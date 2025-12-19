"use client";

import { useThemeEffect } from "@/hooks/use-theme";
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout";
import { AccessControlPage } from "@/components/admin/access-control-page";

export default function AccessControlRoutePage() {
	useThemeEffect();

	return (
		<AdminDashboardLayout>
			<AccessControlPage />
		</AdminDashboardLayout>
	);
}
