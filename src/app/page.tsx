"use client";

import { useEffect } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout";
import { AdminDashboardOverview } from "@/components/admin/admin-dashboard-overview";
import { useThemeEffect } from "@/hooks/use-theme";

export default function HomePage() {
	useThemeEffect();
	const { currentAdmin, setCurrentAdmin, setSystemHealth, setPlatformStats } =
		useAdminStore();

	useEffect(() => {
		// TODO: Replace with actual API calls
		// Example:
		// fetchSystemHealth().then(setSystemHealth)
		// fetchPlatformStats().then(setPlatformStats)
		// fetchCurrentAdmin().then(setCurrentAdmin)
	}, [setCurrentAdmin, setSystemHealth, setPlatformStats]);

	if (!currentAdmin) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
					<p className="text-muted-foreground">Loading admin dashboard...</p>
				</div>
			</div>
		);
	}

	return (
		<AdminDashboardLayout>
			<AdminDashboardOverview />
		</AdminDashboardLayout>
	);
}
