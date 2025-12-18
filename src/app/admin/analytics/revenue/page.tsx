"use client"

import { useThemeEffect } from "@/hooks/use-theme"
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { RevenueAnalyticsPage } from "@/components/admin/revenue-analytics-page"

export default function RevenueAnalyticsRoutePage() {
  useThemeEffect()

  return (
    <AdminDashboardLayout>
      <RevenueAnalyticsPage />
    </AdminDashboardLayout>
  )
}
