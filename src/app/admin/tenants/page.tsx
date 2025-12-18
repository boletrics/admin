"use client"

import { useThemeEffect } from "@/hooks/use-theme"
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { TenantsPage } from "@/components/admin/tenants-page"

export default function TenantsManagementPage() {
  useThemeEffect()

  return (
    <AdminDashboardLayout>
      <TenantsPage />
    </AdminDashboardLayout>
  )
}
