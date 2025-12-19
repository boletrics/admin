"use client";

import { ArrowUpRight, Download } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	mockRevenueTimeline,
	mockRevenueBreakdown,
	mockPlatformStats,
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
	}).format(amount);
}

const planColors = ["#8b5cf6", "#3b82f6", "#06b6d4", "#94a3b8"];

export function RevenueAnalyticsPage() {
	const stats = mockPlatformStats;

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Revenue Analytics</h1>
					<p className="text-muted-foreground">
						Detailed revenue breakdown and trends
					</p>
				</div>
				<Button variant="outline">
					<Download className="h-4 w-4 mr-2" />
					Export Report
				</Button>
			</div>

			{/* KPI Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Monthly Recurring Revenue</CardDescription>
						<CardTitle className="text-2xl">
							{formatCurrency(stats.totalMRR)}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-emerald-600 flex items-center gap-1">
							<ArrowUpRight className="h-3 w-3" />
							+12.5% vs last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Annual Run Rate</CardDescription>
						<CardTitle className="text-2xl">
							{formatCurrency(stats.totalMRR * 12)}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground">
							Projected annual revenue
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Average Revenue Per User</CardDescription>
						<CardTitle className="text-2xl">
							{formatCurrency(stats.totalMRR / stats.activeTenants)}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-emerald-600 flex items-center gap-1">
							<ArrowUpRight className="h-3 w-3" />
							+8.2% vs last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Total Revenue (YTD)</CardDescription>
						<CardTitle className="text-2xl">
							{formatCurrency(stats.totalRevenue)}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground">Since January 2024</p>
					</CardContent>
				</Card>
			</div>

			{/* Main Chart */}
			<Card>
				<CardHeader>
					<CardTitle>Revenue Trend</CardTitle>
					<CardDescription>Monthly recurring revenue over time</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer
						config={{
							mrr: { label: "MRR", color: "hsl(var(--chart-1))" },
						}}
						className="h-[350px]"
					>
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={mockRevenueTimeline}>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
									fillOpacity={0.3}
									strokeWidth={2}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</ChartContainer>
				</CardContent>
			</Card>

			{/* Breakdown */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* By Plan */}
				<Card>
					<CardHeader>
						<CardTitle>Revenue by Plan</CardTitle>
						<CardDescription>
							Distribution across subscription tiers
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{mockRevenueBreakdown.byPlan.map((item, index) => (
								<div key={item.plan} className="space-y-2">
									<div className="flex items-center justify-between text-sm">
										<div className="flex items-center gap-2">
											<div
												className="h-3 w-3 rounded-full"
												style={{ backgroundColor: planColors[index] }}
											/>
											<span>{item.plan}</span>
										</div>
										<div className="flex items-center gap-4">
											<span className="text-muted-foreground">
												{item.percentage}%
											</span>
											<span className="font-medium w-24 text-right">
												{formatCurrency(item.revenue)}
											</span>
										</div>
									</div>
									<Progress value={item.percentage} className="h-2" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* By Region */}
				<Card>
					<CardHeader>
						<CardTitle>Revenue by Region</CardTitle>
						<CardDescription>
							Geographic distribution of revenue
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={{
								revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
							}}
							className="h-[280px]"
						>
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={mockRevenueBreakdown.byRegion}
									layout="vertical"
								>
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-muted"
										horizontal={false}
									/>
									<XAxis
										type="number"
										tickFormatter={(v) => `$${v / 1000}k`}
										className="text-xs"
									/>
									<YAxis
										dataKey="region"
										type="category"
										className="text-xs"
										width={100}
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar
										dataKey="revenue"
										fill="var(--color-revenue)"
										radius={[0, 4, 4, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>

			{/* Top Revenue Tenants */}
			<Card>
				<CardHeader>
					<CardTitle>Top Revenue Contributors</CardTitle>
					<CardDescription>
						Tenants with highest monthly recurring revenue
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Rank</TableHead>
								<TableHead>Tenant</TableHead>
								<TableHead>Plan</TableHead>
								<TableHead className="text-right">MRR</TableHead>
								<TableHead className="text-right">% of Total</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{[
								{
									rank: 1,
									name: "OCESA Presents",
									plan: "Enterprise",
									mrr: 4999,
								},
								{
									rank: 2,
									name: "Live Nation México",
									plan: "Enterprise",
									mrr: 4999,
								},
								{
									rank: 3,
									name: "Zignia Live",
									plan: "Professional",
									mrr: 999,
								},
								{
									rank: 4,
									name: "Teatro Diana",
									plan: "Professional",
									mrr: 999,
								},
								{ rank: 5, name: "EDM México", plan: "Starter", mrr: 299 },
							].map((tenant) => (
								<TableRow key={tenant.rank}>
									<TableCell className="font-medium">#{tenant.rank}</TableCell>
									<TableCell>{tenant.name}</TableCell>
									<TableCell className="capitalize">{tenant.plan}</TableCell>
									<TableCell className="text-right font-medium">
										{formatCurrency(tenant.mrr)}
									</TableCell>
									<TableCell className="text-right text-muted-foreground">
										{((tenant.mrr / stats.totalMRR) * 100).toFixed(1)}%
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
