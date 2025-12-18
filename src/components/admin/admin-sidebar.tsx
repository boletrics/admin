"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Activity,
  Server,
  Users,
  Building2,
  TicketCheck,
  BarChart3,
  Settings,
  Shield,
  Bell,
  ChevronDown,
  ChevronsUpDown,
  LogOut,
  HelpCircle,
  Database,
  Globe,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const monitoringNavItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "System Health",
    url: "/admin/health",
    icon: Server,
  },
  {
    title: "Activity Log",
    url: "/admin/activity",
    icon: Activity,
  },
]

const managementNavItems = [
  {
    title: "Tenants",
    icon: Building2,
    items: [
      { title: "All Tenants", url: "/admin/tenants" },
      { title: "Pending Approval", url: "/admin/tenants/pending" },
      { title: "Suspended", url: "/admin/tenants/suspended" },
    ],
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Support Tickets",
    url: "/admin/tickets",
    icon: TicketCheck,
    badge: 23,
  },
]

const analyticsNavItems = [
  {
    title: "Analytics",
    icon: BarChart3,
    items: [
      { title: "Overview", url: "/admin/analytics" },
      { title: "Revenue", url: "/admin/analytics/revenue" },
      { title: "Growth", url: "/admin/analytics/growth" },
    ],
  },
  {
    title: "Infrastructure",
    icon: Database,
    items: [
      { title: "Database", url: "/admin/infra/database" },
      { title: "CDN & Cache", url: "/admin/infra/cdn" },
      { title: "API Gateway", url: "/admin/infra/api" },
    ],
  },
]

const settingsNavItems = [
  {
    title: "Admin Settings",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Access Control",
    url: "/admin/access",
    icon: Shield,
  },
  {
    title: "Notifications",
    url: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Regions",
    url: "/admin/regions",
    icon: Globe,
  },
]

function AdminLogo() {
  return (
    <SidebarMenuButton size="lg" className="pointer-events-none">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Shield className="h-4 w-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">Boletrics Admin</span>
        <span className="truncate text-xs text-muted-foreground">System Console</span>
      </div>
    </SidebarMenuButton>
  )
}

function NavGroup({
  label,
  items,
}: {
  label: string
  items: typeof monitoringNavItems | typeof managementNavItems
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) =>
            "items" in item && item.items ? (
              <Collapsible key={item.title} asChild defaultOpen={false}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {"badge" in item && item.badge && (
                        <Badge variant="secondary" className="ml-auto mr-2 h-5 px-1.5 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                  <Link href={item.url!}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {"badge" in item && item.badge && (
                      <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ),
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="/admin-avatar.png" alt="Admin" />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">SA</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">System Admin</span>
                <span className="truncate text-xs text-muted-foreground">admin@boletrics.com</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="/admin-avatar.png" alt="Admin" />
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">SA</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">System Administrator</span>
                  <span className="truncate text-xs text-muted-foreground">admin@boletrics.com</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              Documentation
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <AdminLogo />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Monitoring" items={monitoringNavItems} />
        <NavGroup label="Management" items={managementNavItems} />
        <NavGroup label="Analytics & Infrastructure" items={analyticsNavItems} />
        <NavGroup label="Configuration" items={settingsNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
