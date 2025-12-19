"use client";

import { useState, useMemo } from "react";
import { Search, Download, Building2, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { mockUserActivity } from "@/lib/admin-mock-data";

function formatDate(timestamp: string) {
	return new Date(timestamp).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

const actionConfig: Record<string, { label: string; color: string }> = {
	"event.created": {
		label: "Event Created",
		color:
			"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
	},
	"event.published": {
		label: "Event Published",
		color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	},
	"user.login": {
		label: "User Login",
		color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
	},
	"ticket.refund": {
		label: "Refund Processed",
		color:
			"bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
	},
	"settings.updated": {
		label: "Settings Updated",
		color:
			"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
	},
	"team.invited": {
		label: "Team Invited",
		color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
	},
	"report.generated": {
		label: "Report Generated",
		color:
			"bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
	},
	"account.created": {
		label: "Account Created",
		color:
			"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
	},
};

export function ActivityLogPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [actionFilter, setActionFilter] = useState<string>("all");
	const [tenantFilter, setTenantFilter] = useState<string>("all");

	const uniqueTenants = useMemo(() => {
		const tenants = new Set(mockUserActivity.map((a) => a.tenantName));
		return Array.from(tenants);
	}, []);

	const uniqueActions = useMemo(() => {
		const actions = new Set(mockUserActivity.map((a) => a.action));
		return Array.from(actions);
	}, []);

	const filteredActivity = useMemo(() => {
		return mockUserActivity.filter((activity) => {
			const matchesSearch =
				searchQuery === "" ||
				activity.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				activity.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
				activity.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesAction =
				actionFilter === "all" || activity.action === actionFilter;
			const matchesTenant =
				tenantFilter === "all" || activity.tenantName === tenantFilter;
			return matchesSearch && matchesAction && matchesTenant;
		});
	}, [searchQuery, actionFilter, tenantFilter]);

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Activity Log</h1>
					<p className="text-muted-foreground">
						Monitor user actions across all tenants
					</p>
				</div>
				<Button variant="outline">
					<Download className="h-4 w-4 mr-2" />
					Export Log
				</Button>
			</div>

			{/* Filters */}
			<div className="flex items-center gap-3">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search activity..."
						className="pl-9"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<Select value={actionFilter} onValueChange={setActionFilter}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Action Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Actions</SelectItem>
						{uniqueActions.map((action) => (
							<SelectItem key={action} value={action}>
								{actionConfig[action]?.label || action}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={tenantFilter} onValueChange={setTenantFilter}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Tenant" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Tenants</SelectItem>
						{uniqueTenants.map((tenant) => (
							<SelectItem key={tenant} value={tenant}>
								{tenant}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Activity Table */}
			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Action</TableHead>
							<TableHead>Details</TableHead>
							<TableHead>Tenant</TableHead>
							<TableHead>IP Address</TableHead>
							<TableHead>Time</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredActivity.map((activity) => (
							<TableRow key={activity.id}>
								<TableCell>
									<div className="flex items-center gap-3">
										<Avatar className="h-8 w-8">
											<AvatarFallback className="text-xs">
												{activity.userName
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium text-sm">{activity.userName}</p>
											<p className="text-xs text-muted-foreground">
												{activity.userEmail}
											</p>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Badge
										className={
											actionConfig[activity.action]?.color || "bg-slate-100"
										}
									>
										{actionConfig[activity.action]?.label || activity.action}
									</Badge>
								</TableCell>
								<TableCell className="max-w-[300px]">
									<p className="text-sm truncate">{activity.details}</p>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1.5">
										<Building2 className="h-3.5 w-3.5 text-muted-foreground" />
										<span className="text-sm">{activity.tenantName}</span>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1.5">
										<Globe className="h-3.5 w-3.5 text-muted-foreground" />
										<span className="text-sm font-mono">
											{activity.ipAddress}
										</span>
									</div>
								</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{formatDate(activity.timestamp)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
}
