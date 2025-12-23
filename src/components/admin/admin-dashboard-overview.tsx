"use client";

import {
	Loader2,
	Building2,
	Users,
	DollarSign,
	TicketCheck,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	useOrganizations,
	usePlatformAnalytics,
	useSystemHealth,
	useSupportTickets,
} from "@/lib/api/hooks";

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

function formatNumber(num: number) {
	return new Intl.NumberFormat("en-US").format(num);
}

export function AdminDashboardOverview() {
	const { data: analytics, isLoading: isLoadingAnalytics } =
		usePlatformAnalytics();
	const { data: orgsData, isLoading: isLoadingOrgs } = useOrganizations();
	const { data: health, isLoading: isLoadingHealth } = useSystemHealth();
	const { data: ticketsData, isLoading: isLoadingTickets } = useSupportTickets(
		{},
	);

	const isLoading =
		isLoadingAnalytics || isLoadingOrgs || isLoadingHealth || isLoadingTickets;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const stats = {
		totalOrganizations: analytics?.total_organizations ?? 0,
		totalUsers: analytics?.total_users ?? 0,
		totalRevenue: analytics?.total_revenue ?? 0,
		totalOrders: analytics?.total_orders ?? 0,
	};

	return (
		<div className="p-4 md:p-6 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold">Platform Dashboard</h1>
				<p className="text-muted-foreground">
					Overview of your platform metrics and activity
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Organizations
						</CardTitle>
						<Building2 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(stats.totalOrganizations)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(stats.totalUsers)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatCurrency(stats.totalRevenue)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
						<TicketCheck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(stats.totalOrders)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* System Health */}
			<Card>
				<CardHeader>
					<CardTitle>System Health</CardTitle>
					<CardDescription>Current status of platform services</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{health?.services?.map((service, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-3 border rounded-lg"
							>
								<span className="font-medium">{service.name}</span>
								<span
									className={`px-2 py-1 rounded text-xs font-medium ${
										service.status === "healthy"
											? "bg-green-100 text-green-700"
											: service.status === "degraded"
												? "bg-yellow-100 text-yellow-700"
												: "bg-red-100 text-red-700"
									}`}
								>
									{service.status}
								</span>
							</div>
						)) ?? (
							<p className="text-muted-foreground text-center py-4">
								No health data available
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Recent Organizations */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Organizations</CardTitle>
					<CardDescription>
						Latest organizations on the platform
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{orgsData?.data?.slice(0, 5).map((org) => (
							<div
								key={org.id}
								className="flex items-center justify-between p-3 border rounded-lg"
							>
								<div>
									<p className="font-medium">{org.name}</p>
									<p className="text-sm text-muted-foreground">{org.email}</p>
								</div>
								<span
									className={`px-2 py-1 rounded text-xs font-medium ${
										org.status === "active"
											? "bg-green-100 text-green-700"
											: org.status === "pending"
												? "bg-yellow-100 text-yellow-700"
												: "bg-red-100 text-red-700"
									}`}
								>
									{org.status}
								</span>
							</div>
						)) ?? (
							<p className="text-muted-foreground text-center py-4">
								No organizations found
							</p>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
