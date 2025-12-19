"use client";

import { useThemeEffect } from "@/hooks/use-theme";
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout";
import { PendingTenantsPage } from "@/components/admin/pending-tenants-page";

export default function PendingTenantsRoutePage() {
	useThemeEffect();

	return (
		<AdminDashboardLayout>
			<PendingTenantsPage />
		</AdminDashboardLayout>
	);
}
