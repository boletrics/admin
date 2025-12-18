"use client"

import { useThemeEffect } from "@/hooks/use-theme"
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { CDNInfraPage } from "@/components/admin/cdn-infra-page"

export default function CDNInfraRoutePage() {
  useThemeEffect()

  return (
    <AdminDashboardLayout>
      <CDNInfraPage />
    </AdminDashboardLayout>
  )
}
