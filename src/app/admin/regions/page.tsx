"use client"

import { useThemeEffect } from "@/hooks/use-theme"
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { RegionsPage } from "@/components/admin/regions-page"

export default function RegionsRoutePage() {
  useThemeEffect()

  return (
    <AdminDashboardLayout>
      <RegionsPage />
    </AdminDashboardLayout>
  )
}
