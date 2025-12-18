"use client"

import { useThemeEffect } from "@/hooks/use-theme"
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { ActivityLogPage } from "@/components/admin/activity-log-page"

export default function ActivityPage() {
  useThemeEffect()

  return (
    <AdminDashboardLayout>
      <ActivityLogPage />
    </AdminDashboardLayout>
  )
}
