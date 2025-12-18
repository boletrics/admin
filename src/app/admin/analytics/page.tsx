"use client"

import { useThemeEffect } from "@/hooks/use-theme"
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { AnalyticsOverviewPage } from "@/components/admin/analytics-overview-page"

export default function AnalyticsRoutePage() {
  useThemeEffect()

  return (
    <AdminDashboardLayout>
      <AnalyticsOverviewPage />
    </AdminDashboardLayout>
  )
}
