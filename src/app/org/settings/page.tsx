"use client"

import { OrgDashboardLayout } from "@/components/org/org-dashboard-layout"
import { OrgSettingsForm } from "@/components/org/org-settings-form"
import { useThemeEffect } from "@/hooks/use-theme"

export default function OrgSettingsPage() {
  useThemeEffect()

  return (
    <OrgDashboardLayout>
      <OrgSettingsForm />
    </OrgDashboardLayout>
  )
}
