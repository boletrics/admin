"use client";

import { useThemeEffect } from "@/hooks/use-theme";
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout";
import { SuspendedTenantsPage } from "@/components/admin/suspended-tenants-page";

export default function SuspendedTenantsRoutePage() {
	useThemeEffect();

	return (
		<AdminDashboardLayout>
			<SuspendedTenantsPage />
		</AdminDashboardLayout>
	);
}
