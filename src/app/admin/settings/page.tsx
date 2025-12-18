"use client"

import { useThemeEffect } from "@/hooks/use-theme"
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { AdminSettingsPage } from "@/components/admin/admin-settings-page"

export default function SettingsPage() {
  useThemeEffect()

  return (
    <AdminDashboardLayout>
      <AdminSettingsPage />
    </AdminDashboardLayout>
  )
}
