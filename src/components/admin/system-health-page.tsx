"use client";

import { Loader2, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSystemHealth } from "@/lib/api/hooks";

const statusConfig = {
	healthy: {
		label: "Healthy",
		color: "bg-green-100 text-green-700",
		icon: CheckCircle,
	},
	degraded: {
		label: "Degraded",
		color: "bg-yellow-100 text-yellow-700",
		icon: AlertTriangle,
	},
	down: {
		label: "Down",
		color: "bg-red-100 text-red-700",
		icon: XCircle,
	},
};

function formatDate(dateString: string) {
	return new Date(dateString).toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

export function SystemHealthPage() {
	const { data: health, isLoading, mutate } = useSystemHealth();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const overallStatus = health?.overall_status ?? "healthy";
	const services = health?.services ?? [];
	const lastUpdated = health?.last_updated;

	return (
		<div className="p-4 md:p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">System Health</h1>
					<p className="text-muted-foreground">
						Monitor platform services and infrastructure
					</p>
				</div>
				<button
					onClick={() => mutate()}
					className="text-sm text-primary hover:underline"
				>
					Refresh
				</button>
			</div>

			{/* Overall Status */}
			<Card>
				<CardHeader>
					<CardTitle>Overall Status</CardTitle>
					<CardDescription>
						{lastUpdated && `Last checked: ${formatDate(lastUpdated)}`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-3">
						{(() => {
							const config = statusConfig[overallStatus];
							const Icon = config.icon;
							return (
								<>
									<Icon className={`h-8 w-8 ${config.color.split(" ")[1]}`} />
									<div>
										<p className="text-xl font-semibold">{config.label}</p>
										<p className="text-sm text-muted-foreground">
											All systems{" "}
											{overallStatus === "healthy"
												? "operational"
												: "experiencing issues"}
										</p>
									</div>
								</>
							);
						})()}
					</div>
				</CardContent>
			</Card>

			{/* Services */}
			<Card>
				<CardHeader>
					<CardTitle>Services</CardTitle>
					<CardDescription>Individual service health status</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{services.length === 0 ? (
							<p className="text-muted-foreground text-center py-8">
								No service data available
							</p>
						) : (
							services.map((service, index) => {
								const config = statusConfig[service.status];
								const Icon = config.icon;

								return (
									<div
										key={index}
										className="flex items-center justify-between p-4 border rounded-lg"
									>
										<div className="flex items-center gap-3">
											<Icon
												className={`h-5 w-5 ${config.color.split(" ")[1]}`}
											/>
											<div>
												<p className="font-medium">{service.name}</p>
												{service.message && (
													<p className="text-sm text-muted-foreground">
														{service.message}
													</p>
												)}
											</div>
										</div>
										<div className="flex items-center gap-4">
											{service.latency_ms && (
												<span className="text-sm text-muted-foreground">
													{service.latency_ms}ms
												</span>
											)}
											<Badge className={config.color}>{config.label}</Badge>
										</div>
									</div>
								);
							})
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
