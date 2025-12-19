"use client";

import {
	Users,
	Building2,
	ArrowUpRight,
	ArrowDownRight,
	Target,
	UserPlus,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { mockGrowthMetrics, mockPlatformStats } from "@/lib/admin-mock-data";
import {
	Area,
	Bar,
	BarChart,
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	CartesianGrid,
	ComposedChart,
} from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

function formatNumber(num: number) {
	return new Intl.NumberFormat("en-US").format(num);
}

export function GrowthAnalyticsPage() {
	const stats = mockPlatformStats;

	// Calculate growth metrics
	const userGrowthRate = (
		((mockGrowthMetrics.userGrowth[6].users -
			mockGrowthMetrics.userGrowth[0].users) /
			mockGrowthMetrics.userGrowth[0].users) *
		100
	).toFixed(1);
	const tenantGrowthRate = (
		((mockGrowthMetrics.tenantGrowth[6].tenants -
			mockGrowthMetrics.tenantGrowth[0].tenants) /
			mockGrowthMetrics.tenantGrowth[0].tenants) *
		100
	).toFixed(1);

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold">Growth Analytics</h1>
				<p className="text-muted-foreground">
					Track platform growth and user acquisition
				</p>
			</div>

			{/* KPI Cards */}
			<div className="grid gap-4 md:grid-cols-4">
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
							<ArrowUpRight className="h-3 w-3" />+{userGrowthRate}% (6 mo)
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Total Tenants</CardDescription>
						<Building2 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(stats.totalTenants)}
						</div>
						<p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
							<ArrowUpRight className="h-3 w-3" />+{tenantGrowthRate}% (6 mo)
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>New This Month</CardDescription>
						<UserPlus className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">30</div>
						<p className="text-xs text-red-600 flex items-center gap-1 mt-1">
							<ArrowDownRight className="h-3 w-3" />
							-37.5% vs last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Conversion Rate</CardDescription>
						<Target className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">4.2%</div>
						<p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
							<ArrowUpRight className="h-3 w-3" />
							+0.2% vs last month
						</p>
					</CardContent>
				</Card>
			</div>

			{/* User Growth Chart */}
			<Card>
				<CardHeader>
					<CardTitle>User Growth</CardTitle>
					<CardDescription>Total and new users over time</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer
						config={{
							users: { label: "Total Users", color: "hsl(var(--chart-1))" },
							newUsers: { label: "New Users", color: "hsl(var(--chart-2))" },
						}}
						className="h-[350px]"
					>
						<ResponsiveContainer width="100%" height="100%">
							<ComposedChart data={mockGrowthMetrics.userGrowth}>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis dataKey="month" className="text-xs" />
								<YAxis
									yAxisId="left"
									tickFormatter={(v) => `${v / 1000}k`}
									className="text-xs"
								/>
								<YAxis
									yAxisId="right"
									orientation="right"
									className="text-xs"
								/>
								<ChartTooltip content={<ChartTooltipContent />} />
								<Area
									yAxisId="left"
									type="monotone"
									dataKey="users"
									stroke="var(--color-users)"
									fill="var(--color-users)"
									fillOpacity={0.2}
									strokeWidth={2}
								/>
								<Bar
									yAxisId="right"
									dataKey="newUsers"
									fill="var(--color-newUsers)"
									radius={[4, 4, 0, 0]}
								/>
							</ComposedChart>
						</ResponsiveContainer>
					</ChartContainer>
				</CardContent>
			</Card>

			{/* Tenant Growth and Churn */}
			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Tenant Acquisition vs Churn</CardTitle>
						<CardDescription>
							New tenants and churned tenants comparison
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={{
								new: {
									label: "New Tenants",
									color: "hsl(142.1, 76.2%, 36.3%)",
								},
								churn: { label: "Churned", color: "hsl(0, 84.2%, 60.2%)" },
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

				<Card>
					<CardHeader>
						<CardTitle>Conversion Rate Trend</CardTitle>
						<CardDescription>Free to paid conversion over time</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={{
								rate: {
									label: "Conversion Rate",
									color: "hsl(var(--chart-1))",
								},
							}}
							className="h-[300px]"
						>
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={mockGrowthMetrics.conversionRate}>
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-muted"
									/>
									<XAxis dataKey="month" className="text-xs" />
									<YAxis
										tickFormatter={(v) => `${v}%`}
										className="text-xs"
										domain={[0, 6]}
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Line
										type="monotone"
										dataKey="rate"
										stroke="var(--color-rate)"
										strokeWidth={2}
										dot={{ fill: "var(--color-rate)" }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>

			{/* Growth Metrics Summary */}
			<Card>
				<CardHeader>
					<CardTitle>Growth Summary</CardTitle>
					<CardDescription>
						Key growth indicators for the past 6 months
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6 md:grid-cols-3">
						<div className="space-y-2">
							<h4 className="font-medium">Net Tenant Growth</h4>
							<p className="text-3xl font-bold text-emerald-600">+267</p>
							<p className="text-sm text-muted-foreground">
								Total tenants added (net of churn)
							</p>
						</div>
						<div className="space-y-2">
							<h4 className="font-medium">Net User Growth</h4>
							<p className="text-3xl font-bold text-emerald-600">+7,332</p>
							<p className="text-sm text-muted-foreground">
								Total users added across all tenants
							</p>
						</div>
						<div className="space-y-2">
							<h4 className="font-medium">Churn Rate</h4>
							<p className="text-3xl font-bold text-amber-600">0.8%</p>
							<p className="text-sm text-muted-foreground">
								Monthly tenant churn rate
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
