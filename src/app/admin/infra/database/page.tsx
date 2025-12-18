"use client"

import { useThemeEffect } from "@/hooks/use-theme"
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { DatabaseInfraPage } from "@/components/admin/database-infra-page"

export default function DatabaseInfraRoutePage() {
  useThemeEffect()

  return (
    <AdminDashboardLayout>
      <DatabaseInfraPage />
    </AdminDashboardLayout>
  )
}
