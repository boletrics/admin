"use client";

import {
	Users,
	Building2,
	DollarSign,
	TicketCheck,
	ArrowUpRight,
	ArrowDownRight,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	mockPlatformStats,
	mockRevenueTimeline,
	mockGrowthMetrics,
} from "@/lib/admin-mock-data";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	CartesianGrid,
} from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
	}).format(amount);
}

function formatNumber(num: number) {
	return new Intl.NumberFormat("en-US").format(num);
}

export function AnalyticsOverviewPage() {
	const stats = mockPlatformStats;

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold">Analytics Overview</h1>
				<p className="text-muted-foreground">
					Platform performance and key metrics
				</p>
			</div>

			{/* KPI Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Total MRR</CardDescription>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatCurrency(stats.totalMRR)}
						</div>
						<p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
							<ArrowUpRight className="h-3 w-3" />
							+12.5% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Active Tenants</CardDescription>
						<Building2 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(stats.activeTenants)}
						</div>
						<p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
							<ArrowUpRight className="h-3 w-3" />
							+5.2% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Total Users</CardDescription>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(stats.totalUsers)}
						</div>
						<p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
							<ArrowUpRight className="h-3 w-3" />
							+8.1% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Open Tickets</CardDescription>
						<TicketCheck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.openTickets}</div>
						<p className="text-xs text-red-600 flex items-center gap-1 mt-1">
							<ArrowDownRight className="h-3 w-3" />
							+3 from yesterday
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts Row */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* MRR Trend */}
				<Card>
					<CardHeader>
						<CardTitle>Monthly Recurring Revenue</CardTitle>
						<CardDescription>MRR trend over the last 7 months</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={{
								mrr: { label: "MRR", color: "hsl(var(--chart-1))" },
							}}
							className="h-[300px]"
						>
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={mockRevenueTimeline}>
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-muted"
									/>
									<XAxis dataKey="month" className="text-xs" />
									<YAxis
										tickFormatter={(v) => `$${v / 1000}k`}
										className="text-xs"
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Area
										type="monotone"
										dataKey="mrr"
										stroke="var(--color-mrr)"
										fill="var(--color-mrr)"
										fillOpacity={0.2}
										strokeWidth={2}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</ChartContainer>
					</CardContent>
				</Card>

				{/* Tenant Growth */}
				<Card>
					<CardHeader>
						<CardTitle>Tenant Growth</CardTitle>
						<CardDescription>New tenants and churn over time</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={{
								new: { label: "New Tenants", color: "hsl(var(--chart-1))" },
								churn: { label: "Churned", color: "hsl(var(--chart-2))" },
							}}
							className="h-[300px]"
						>
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={mockGrowthMetrics.tenantGrowth}>
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-muted"
									/>
									<XAxis dataKey="month" className="text-xs" />
									<YAxis className="text-xs" />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar
										dataKey="new"
										fill="var(--color-new)"
										radius={[4, 4, 0, 0]}
									/>
									<Bar
										dataKey="churn"
										fill="var(--color-churn)"
										radius={[4, 4, 0, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>

			{/* Second Row */}
			<div className="grid gap-6 lg:grid-cols-3">
				{/* User Growth */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>User Growth</CardTitle>
						<CardDescription>Total platform users over time</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={{
								users: { label: "Total Users", color: "hsl(var(--chart-1))" },
								newUsers: { label: "New Users", color: "hsl(var(--chart-3))" },
							}}
							className="h-[250px]"
						>
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={mockGrowthMetrics.userGrowth}>
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-muted"
									/>
									<XAxis dataKey="month" className="text-xs" />
									<YAxis
										tickFormatter={(v) => `${v / 1000}k`}
										className="text-xs"
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Area
										type="monotone"
										dataKey="users"
										stroke="var(--color-users)"
										fill="var(--color-users)"
										fillOpacity={0.2}
										strokeWidth={2}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</ChartContainer>
					</CardContent>
				</Card>

				{/* Quick Stats */}
				<Card>
					<CardHeader>
						<CardTitle>Platform Health</CardTitle>
						<CardDescription>Key performance indicators</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Uptime</span>
							<span className="font-semibold text-emerald-600">
								{stats.uptime}%
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">
								Avg Response Time
							</span>
							<span className="font-semibold">{stats.avgResponseTime}h</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">
								Total Revenue (YTD)
							</span>
							<span className="font-semibold">
								{formatCurrency(stats.totalRevenue)}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">
								Conversion Rate
							</span>
							<span className="font-semibold">4.2%</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Churn Rate</span>
							<span className="font-semibold text-amber-600">0.8%</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
