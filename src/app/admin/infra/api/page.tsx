"use client";

import { useThemeEffect } from "@/hooks/use-theme";
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout";
import { APIInfraPage } from "@/components/admin/api-infra-page";

export default function APIInfraRoutePage() {
	useThemeEffect();

	return (
		<AdminDashboardLayout>
			<APIInfraPage />
		</AdminDashboardLayout>
	);
}
