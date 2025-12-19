"use client";

import type React from "react";
import {
	Server,
	Database,
	Globe,
	Zap,
	HardDrive,
	Activity,
	RefreshCw,
	CheckCircle,
	AlertTriangle,
	XCircle,
	Clock,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockSystemHealth } from "@/lib/admin-mock-data";

const serviceIcons: Record<string, React.ElementType> = {
	api: Server,
	db: Database,
	cache: Zap,
	cdn: Globe,
	payments: Activity,
	email: Activity,
	storage: HardDrive,
	search: Activity,
};

const statusConfig = {
	operational: {
		label: "Operational",
		color: "text-emerald-500",
		bgColor: "bg-emerald-500",
		icon: CheckCircle,
	},
	degraded: {
		label: "Degraded",
		color: "text-amber-500",
		bgColor: "bg-amber-500",
		icon: AlertTriangle,
	},
	down: {
		label: "Down",
		color: "text-red-500",
		bgColor: "bg-red-500",
		icon: XCircle,
	},
};

export function SystemHealthPage() {
	const health = mockSystemHealth;

	const operationalCount = health.services.filter(
		(s) => s.status === "operational",
	).length;
	const degradedCount = health.services.filter(
		(s) => s.status === "degraded",
	).length;
	const downCount = health.services.filter((s) => s.status === "down").length;

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">System Health</h1>
					<p className="text-muted-foreground">
						Monitor infrastructure and service status
					</p>
				</div>
				<Button variant="outline">
					<RefreshCw className="h-4 w-4 mr-2" />
					Refresh Status
				</Button>
			</div>

			{/* Overall Status */}
			<Card
				className={
					health.status === "healthy"
						? "border-emerald-500/50 bg-emerald-500/5"
						: health.status === "degraded"
							? "border-amber-500/50 bg-amber-500/5"
							: "border-red-500/50 bg-red-500/5"
				}
			>
				<CardContent className="pt-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div
								className={`h-12 w-12 rounded-full flex items-center justify-center ${
									health.status === "healthy"
										? "bg-emerald-500/20"
										: health.status === "degraded"
											? "bg-amber-500/20"
											: "bg-red-500/20"
								}`}
							>
								{health.status === "healthy" ? (
									<CheckCircle className="h-6 w-6 text-emerald-500" />
								) : health.status === "degraded" ? (
									<AlertTriangle className="h-6 w-6 text-amber-500" />
								) : (
									<XCircle className="h-6 w-6 text-red-500" />
								)}
							</div>
							<div>
								<h2 className="text-xl font-semibold">
									{health.status === "healthy"
										? "All Systems Operational"
										: health.status === "degraded"
											? "Partial System Outage"
											: "Major System Outage"}
								</h2>
								<p className="text-muted-foreground">
									Last checked:{" "}
									{new Date(health.lastChecked).toLocaleTimeString()}
								</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-3xl font-bold">{health.uptime}%</p>
							<p className="text-sm text-muted-foreground">Uptime this month</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Status Summary */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Operational</CardDescription>
						<CardTitle className="text-2xl text-emerald-500">
							{operationalCount}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground">
							services running normally
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Degraded</CardDescription>
						<CardTitle className="text-2xl text-amber-500">
							{degradedCount}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground">
							services with issues
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Down</CardDescription>
						<CardTitle className="text-2xl text-red-500">{downCount}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground">services offline</p>
					</CardContent>
				</Card>
			</div>

			{/* Services Grid */}
			<div>
				<h3 className="text-lg font-semibold mb-4">Services</h3>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{health.services.map((service) => {
						const Icon = serviceIcons[service.id] || Server;
						const status = statusConfig[service.status];
						const StatusIcon = status.icon;

						return (
							<Card key={service.id} className="relative overflow-hidden">
								<CardHeader className="pb-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Icon className="h-4 w-4 text-muted-foreground" />
											<CardTitle className="text-sm font-medium">
												{service.name}
											</CardTitle>
										</div>
										<StatusIcon className={`h-4 w-4 ${status.color}`} />
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-between">
										<Badge variant="outline" className={status.color}>
											{status.label}
										</Badge>
										<div className="flex items-center gap-1 text-sm text-muted-foreground">
											<Clock className="h-3 w-3" />
											{service.latency}ms
										</div>
									</div>
									{service.lastIncident && (
										<p className="text-xs text-muted-foreground mt-2">
											Last incident:{" "}
											{new Date(service.lastIncident).toLocaleDateString()}
										</p>
									)}
								</CardContent>
								<div
									className={`absolute bottom-0 left-0 right-0 h-1 ${status.bgColor}`}
								/>
							</Card>
						);
					})}
				</div>
			</div>

			{/* Performance Metrics */}
			<Card>
				<CardHeader>
					<CardTitle>Performance Metrics</CardTitle>
					<CardDescription>Current system resource utilization</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span>CPU Usage</span>
							<span className="font-medium">42%</span>
						</div>
						<Progress value={42} className="h-2" />
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span>Memory Usage</span>
							<span className="font-medium">68%</span>
						</div>
						<Progress value={68} className="h-2" />
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span>Disk Usage</span>
							<span className="font-medium">54%</span>
						</div>
						<Progress value={54} className="h-2" />
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span>Network Bandwidth</span>
							<span className="font-medium">31%</span>
						</div>
						<Progress value={31} className="h-2" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
