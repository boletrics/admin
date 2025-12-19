"use client";

import type React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface AdminDashboardLayoutProps {
	children: React.ReactNode;
}

export function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
	return (
		<SidebarProvider>
			<AdminSidebar />
			<SidebarInset>
				<AdminHeader />
				<main className="flex-1 overflow-x-hidden overflow-y-auto">
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
