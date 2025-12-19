"use client";

import {
	Globe,
	Activity,
	Zap,
	MapPin,
	RefreshCw,
	CheckCircle,
	TrendingUp,
} from "lucide-react";
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
import { mockCDNMetrics } from "@/lib/admin-mock-data";
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

const bandwidthData = [
	{ time: "00:00", bandwidth: 1.2 },
	{ time: "04:00", bandwidth: 0.8 },
	{ time: "08:00", bandwidth: 1.8 },
	{ time: "12:00", bandwidth: 2.4 },
	{ time: "16:00", bandwidth: 2.8 },
	{ time: "20:00", bandwidth: 2.2 },
	{ time: "Now", bandwidth: 2.4 },
];

const edgeLocations = [
	{ name: "Mexico City", status: "active", requests: "4.2K/s", latency: 12 },
	{ name: "Monterrey", status: "active", requests: "1.8K/s", latency: 18 },
	{ name: "Guadalajara", status: "active", requests: "1.2K/s", latency: 15 },
	{ name: "Dallas", status: "active", requests: "2.1K/s", latency: 28 },
	{ name: "Los Angeles", status: "active", requests: "1.9K/s", latency: 35 },
	{ name: "Miami", status: "active", requests: "1.3K/s", latency: 42 },
];

export function CDNInfraPage() {
	const cdn = mockCDNMetrics;
	const bandwidthPercent = (cdn.bandwidthUsed / cdn.bandwidthTotal) * 100;

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">CDN & Cache</h1>
					<p className="text-muted-foreground">
						Content delivery and caching performance
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline">
						<RefreshCw className="h-4 w-4 mr-2" />
						Purge Cache
					</Button>
				</div>
			</div>

			{/* Status Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Requests/Second</CardDescription>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{cdn.requestsPerSecond.toLocaleString()}
						</div>
						<p className="text-xs text-emerald-600 mt-2">+15% from average</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Cache Hit Rate</CardDescription>
						<Zap className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{cdn.cacheHitRate}%</div>
						<p className="text-xs text-emerald-600 mt-2">
							Excellent performance
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Bandwidth Used</CardDescription>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{cdn.bandwidthUsed}TB/{cdn.bandwidthTotal}TB
						</div>
						<Progress value={bandwidthPercent} className="h-2 mt-2" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Edge Locations</CardDescription>
						<Globe className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{cdn.activeEdges}/{cdn.edgeLocations}
						</div>
						<p className="text-xs text-emerald-600 mt-2">
							All locations active
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Bandwidth Chart */}
			<Card>
				<CardHeader>
					<CardTitle>Bandwidth Usage</CardTitle>
					<CardDescription>
						Data transfer over the last 24 hours (TB)
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer
						config={{
							bandwidth: {
								label: "Bandwidth (TB)",
								color: "hsl(var(--chart-1))",
							},
						}}
						className="h-[300px]"
					>
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={bandwidthData}>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis dataKey="time" className="text-xs" />
								<YAxis tickFormatter={(v) => `${v}TB`} className="text-xs" />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Area
									type="monotone"
									dataKey="bandwidth"
									stroke="var(--color-bandwidth)"
									fill="var(--color-bandwidth)"
									fillOpacity={0.2}
									strokeWidth={2}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</ChartContainer>
				</CardContent>
			</Card>

			{/* Edge Locations */}
			<Card>
				<CardHeader>
					<CardTitle>Edge Locations</CardTitle>
					<CardDescription>
						CDN points of presence and their performance
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Location</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Requests</TableHead>
								<TableHead className="text-right">Latency</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{edgeLocations.map((location) => (
								<TableRow key={location.name}>
									<TableCell>
										<div className="flex items-center gap-2">
											<MapPin className="h-4 w-4 text-muted-foreground" />
											<span className="font-medium">{location.name}</span>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant="outline" className="text-emerald-600">
											<CheckCircle className="h-3 w-3 mr-1" />
											Active
										</Badge>
									</TableCell>
									<TableCell>{location.requests}</TableCell>
									<TableCell className="text-right">
										{location.latency}ms
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
