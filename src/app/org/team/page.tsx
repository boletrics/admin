"use client";

import { OrgDashboardLayout } from "@/components/org/org-dashboard-layout";
import { OrgTeamTable } from "@/components/org/org-team-table";
import { useThemeEffect } from "@/hooks/use-theme";

export default function OrgTeamPage() {
	useThemeEffect();

	return (
		<OrgDashboardLayout>
			<div className="p-6 space-y-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Equipo</h1>
					<p className="text-muted-foreground">
						Administra los miembros de tu organización y sus permisos
					</p>
				</div>
				<OrgTeamTable />
			</div>
		</OrgDashboardLayout>
	);
}
