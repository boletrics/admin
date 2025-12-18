"use client"

import type React from "react"
import { Building2, Users, DollarSign, TicketCheck, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Cell, PieChart, Pie } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  mockPlatformStats,
  mockSystemHealth,
  mockTenants,
  mockSupportTickets,
  mockUserActivity,
  mockRevenueTimeline,
  mockTicketStats,
} from "@/lib/admin-mock-data"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatNumber(num: number) {
  return new Intl.NumberFormat("en-US").format(num)
}

function getRelativeTime(timestamp: string) {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendLabel,
  variant = "default",
}: {
  title: string
  value: string
  description: string
  icon: React.ElementType
  trend?: number
  trendLabel?: string
  variant?: "default" | "success" | "warning" | "danger"
}) {
  const isPositive = trend && trend > 0
  const variantStyles = {
    default: "text-muted-foreground",
    success: "text-emerald-500",
    warning: "text-amber-500",
    danger: "text-red-500",
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 shrink-0 ${variantStyles[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {trend !== undefined && (
            <Badge variant={isPositive ? "default" : "destructive"} className="gap-1 px-1.5 py-0.5 text-xs shrink-0">
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(trend)}%
            </Badge>
          )}
          <p className="text-xs text-muted-foreground truncate">{trendLabel || description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function SystemHealthCard() {
  const health = mockSystemHealth

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-base">System Health</CardTitle>
          <Badge
            variant={
              health.status === "healthy" ? "default" : health.status === "degraded" ? "secondary" : "destructive"
            }
            className={`shrink-0 w-fit ${
              health.status === "healthy"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : ""
            }`}
          >
            {health.status === "healthy" ? "All Systems Operational" : health.status}
          </Badge>
        </div>
        <CardDescription>{health.uptime}% uptime this month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {health.services.slice(0, 5).map((service) => (
          <div key={service.id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`h-2 w-2 rounded-full shrink-0 ${
                  service.status === "operational"
                    ? "bg-emerald-500"
                    : service.status === "degraded"
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
              />
              <span className="text-sm truncate">{service.name}</span>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{service.latency}ms</span>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full mt-2">
          View All Services
        </Button>
      </CardContent>
    </Card>
  )
}

function RevenueChart() {
  const chartConfig = {
    mrr: {
      label: "MRR",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card className="col-span-full lg:col-span-2 overflow-hidden">
      <CardHeader>
        <CardTitle>Monthly Recurring Revenue</CardTitle>
        <CardDescription>Platform MRR over the last 7 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart data={mockRevenueTimeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label) => `Month: ${label}`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="mrr"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMrr)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function TicketStatusChart() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Ticket Distribution</CardTitle>
        <CardDescription>By status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            count: { label: "Count" },
          }}
          className="h-[200px] w-full"
        >
          <PieChart>
            <Pie
              data={mockTicketStats.byStatus}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {mockTicketStats.byStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          {mockTicketStats.byStatus.slice(0, 4).map((item) => (
            <div key={item.status} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground">{item.status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RecentTickets() {
  const openTickets = mockSupportTickets.filter((t) => t.status === "open" || t.status === "in-progress")

  const priorityColors = {
    critical: "bg-red-500",
    high: "bg-amber-500",
    medium: "bg-blue-500",
    low: "bg-slate-400",
  }

  return (
    <Card className="col-span-full lg:col-span-2 overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="min-w-0">
            <CardTitle>Open Support Tickets</CardTitle>
            <CardDescription>{openTickets.length} tickets require attention</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 w-fit bg-transparent">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {openTickets.slice(0, 4).map((ticket) => (
            <div
              key={ticket.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer overflow-hidden"
            >
              <span className={`h-2 w-2 rounded-full mt-2 shrink-0 ${priorityColors[ticket.priority]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <p className="font-medium truncate">{ticket.subject}</p>
                  <Badge variant="outline" className="text-xs shrink-0 w-fit">
                    {ticket.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{ticket.tenantName}</p>
                <p className="text-xs text-muted-foreground mt-1">{getRelativeTime(ticket.createdAt)}</p>
              </div>
              <Badge
                variant={ticket.status === "in-progress" ? "secondary" : "outline"}
                className="shrink-0 hidden sm:inline-flex"
              >
                {ticket.status}
              </Badge>
              <span
                className={`sm:hidden text-xs px-1.5 py-0.5 rounded shrink-0 ${
                  ticket.status === "in-progress"
                    ? "bg-secondary text-secondary-foreground"
                    : "border text-muted-foreground"
                }`}
              >
                {ticket.status === "in-progress" ? "WIP" : ticket.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RecentActivity() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="w-fit">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockUserActivity.slice(0, 6).map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs">
                  {activity.userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.userName}</span>
                  <span className="text-muted-foreground"> {activity.details}</span>
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {activity.tenantName} · {getRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function TopTenants() {
  const activeTenants = mockTenants.filter((t) => t.status === "active").sort((a, b) => b.mrr - a.mrr)

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle>Top Tenants by MRR</CardTitle>
          <Button variant="ghost" size="sm" className="w-fit">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeTenants.slice(0, 5).map((tenant, index) => (
            <div key={tenant.id} className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-4 shrink-0">{index + 1}</span>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs bg-primary/10">
                  {tenant.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tenant.name}</p>
                <p className="text-xs text-muted-foreground">{tenant.plan} plan</p>
              </div>
              <span className="text-sm font-semibold shrink-0">{formatCurrency(tenant.mrr)}/mo</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActions() {
  const actions = [
    { label: "View Pending Approvals", href: "/admin/tenants/pending", count: 1 },
    { label: "Manage Tickets", href: "/admin/tickets", count: 23 },
    { label: "System Health", href: "/admin/health" },
    { label: "Generate Report", href: "/admin/analytics" },
  ]

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {actions.map((action) => (
          <Button key={action.label} variant="outline" className="w-full justify-between bg-transparent" asChild>
            <a href={action.href}>
              <span className="truncate">{action.label}</span>
              {action.count && (
                <Badge variant="secondary" className="ml-2 shrink-0">
                  {action.count}
                </Badge>
              )}
            </a>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

export function AdminDashboardOverview() {
  const stats = mockPlatformStats

  return (
    <div className="p-4 sm:p-6 space-y-6 overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform health, manage tenants, and handle support tickets</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tenants"
          value={formatNumber(stats.totalTenants)}
          description={`${stats.activeTenants} active`}
          icon={Building2}
          trend={5.2}
          trendLabel="vs. last month"
        />
        <StatCard
          title="Platform MRR"
          value={formatCurrency(stats.totalMRR)}
          description="Monthly recurring revenue"
          icon={DollarSign}
          trend={8.4}
          trendLabel="vs. last month"
        />
        <StatCard
          title="Total Users"
          value={formatNumber(stats.totalUsers)}
          description="Across all tenants"
          icon={Users}
          trend={12.1}
          trendLabel="vs. last month"
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets.toString()}
          description={`${stats.avgResponseTime}h avg response`}
          icon={TicketCheck}
          variant={stats.openTickets > 20 ? "warning" : "default"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RevenueChart />
        <TicketStatusChart />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RecentTickets />
        <SystemHealthCard />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RecentActivity />
        <TopTenants />
        <QuickActions />
      </div>
    </div>
  )
}
