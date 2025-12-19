"use client";

import { Server, Activity, Zap, AlertTriangle, RefreshCw } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockAPIMetrics } from "@/lib/admin-mock-data";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Area,
	AreaChart,
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

const requestsData = [
	{ time: "00:00", requests: 32000 },
	{ time: "04:00", requests: 18000 },
	{ time: "08:00", requests: 42000 },
	{ time: "12:00", requests: 55000 },
	{ time: "16:00", requests: 48000 },
	{ time: "20:00", requests: 38000 },
	{ time: "Now", requests: 45000 },
];

const endpointStats = [
	{ endpoint: "/api/events", requests: 12500, avgLatency: 42, errorRate: 0.01 },
	{ endpoint: "/api/tickets", requests: 8900, avgLatency: 65, errorRate: 0.02 },
	{ endpoint: "/api/users", requests: 6200, avgLatency: 38, errorRate: 0.01 },
	{ endpoint: "/api/orders", requests: 4800, avgLatency: 120, errorRate: 0.03 },
	{
		endpoint: "/api/analytics",
		requests: 2100,
		avgLatency: 180,
		errorRate: 0.02,
	},
];

export function APIInfraPage() {
	const api = mockAPIMetrics;

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">API Gateway</h1>
					<p className="text-muted-foreground">
						API performance and request monitoring
					</p>
				</div>
				<Button variant="outline">
					<RefreshCw className="h-4 w-4 mr-2" />
					Refresh Metrics
				</Button>
			</div>

			{/* Status Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Requests/Minute</CardDescription>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{api.requestsPerMinute.toLocaleString()}
						</div>
						<p className="text-xs text-emerald-600 mt-2">Within capacity</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Avg Latency</CardDescription>
						<Zap className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{api.avgLatency}ms</div>
						<p className="text-xs text-emerald-600 mt-2">Excellent</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Error Rate</CardDescription>
						<AlertTriangle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{api.errorRate}%</div>
						<p className="text-xs text-emerald-600 mt-2">Below threshold</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Active Connections</CardDescription>
						<Server className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{api.activeConnections.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground mt-2">concurrent</p>
					</CardContent>
				</Card>
			</div>

			{/* Latency Distribution */}
			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Request Volume</CardTitle>
						<CardDescription>Requests per minute over 24 hours</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={{
								requests: { label: "Requests", color: "hsl(var(--chart-1))" },
							}}
							className="h-[300px]"
						>
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={requestsData}>
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-muted"
									/>
									<XAxis dataKey="time" className="text-xs" />
									<YAxis
										tickFormatter={(v) => `${v / 1000}k`}
										className="text-xs"
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Area
										type="monotone"
										dataKey="requests"
										stroke="var(--color-requests)"
										fill="var(--color-requests)"
										fillOpacity={0.2}
										strokeWidth={2}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</ChartContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Latency Percentiles</CardTitle>
						<CardDescription>Response time distribution</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="flex items-center gap-2">
									<Badge variant="outline">p50</Badge>
									<span className="text-muted-foreground">Median</span>
								</span>
								<span className="font-medium">{api.avgLatency}ms</span>
							</div>
							<Progress value={25} className="h-2" />
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="flex items-center gap-2">
									<Badge variant="outline">p95</Badge>
									<span className="text-muted-foreground">95th percentile</span>
								</span>
								<span className="font-medium">120ms</span>
							</div>
							<Progress value={65} className="h-2" />
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="flex items-center gap-2">
									<Badge variant="outline">p99</Badge>
									<span className="text-muted-foreground">99th percentile</span>
								</span>
								<span className="font-medium">{api.p99Latency}ms</span>
							</div>
							<Progress value={95} className="h-2" />
						</div>

						<div className="pt-4 border-t">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">
									Rate Limit Hits (24h)
								</span>
								<Badge variant="secondary">
									{api.rateLimitHits24h.toLocaleString()}
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Endpoint Stats */}
			<Card>
				<CardHeader>
					<CardTitle>Top Endpoints</CardTitle>
					<CardDescription>
						Most used API endpoints and their performance
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Endpoint</TableHead>
								<TableHead className="text-right">Requests/min</TableHead>
								<TableHead className="text-right">Avg Latency</TableHead>
								<TableHead className="text-right">Error Rate</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{endpointStats.map((endpoint) => (
								<TableRow key={endpoint.endpoint}>
									<TableCell className="font-mono text-sm">
										{endpoint.endpoint}
									</TableCell>
									<TableCell className="text-right">
										{endpoint.requests.toLocaleString()}
									</TableCell>
									<TableCell className="text-right">
										{endpoint.avgLatency}ms
									</TableCell>
									<TableCell className="text-right">
										{endpoint.errorRate}%
									</TableCell>
									<TableCell>
										<Badge variant="outline" className="text-emerald-600">
											Healthy
										</Badge>
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
