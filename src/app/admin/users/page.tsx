"use client"

import { useThemeEffect } from "@/hooks/use-theme"
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { UsersPage } from "@/components/admin/users-page"

export default function UsersRoutePage() {
  useThemeEffect()

  return (
    <AdminDashboardLayout>
      <UsersPage />
    </AdminDashboardLayout>
  )
}
