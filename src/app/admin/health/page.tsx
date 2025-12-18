"use client"

import { useThemeEffect } from "@/hooks/use-theme"
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { SystemHealthPage } from "@/components/admin/system-health-page"

export default function HealthPage() {
  useThemeEffect()

  return (
    <AdminDashboardLayout>
      <SystemHealthPage />
    </AdminDashboardLayout>
  )
}
