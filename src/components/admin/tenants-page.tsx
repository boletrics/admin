"use client";

import { useState } from "react";
import { Loader2, Search, Building2, MoreHorizontal } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	useOrganizations,
	useSuspendOrganization,
	useReactivateOrganization,
} from "@/lib/api/hooks";
import type { Organization } from "@/lib/api/types";

const statusColors: Record<Organization["status"], string> = {
	active: "bg-green-100 text-green-700",
	pending: "bg-yellow-100 text-yellow-700",
	suspended: "bg-red-100 text-red-700",
	inactive: "bg-gray-100 text-gray-700",
};

const planColors: Record<Organization["plan"], string> = {
	starter: "bg-gray-100 text-gray-700",
	professional: "bg-blue-100 text-blue-700",
	enterprise: "bg-purple-100 text-purple-700",
};

function formatDate(dateString: string) {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

export function TenantsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		Organization["status"] | "all"
	>("all");

	const {
		data: orgsData,
		isLoading,
		mutate,
	} = useOrganizations({
		status: statusFilter !== "all" ? statusFilter : undefined,
	});

	const organizations = orgsData?.data ?? [];

	const filteredOrgs = organizations.filter(
		(org) =>
			org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			org.email.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Stats
	const stats = {
		total: organizations.length,
		active: organizations.filter((o) => o.status === "active").length,
		pending: organizations.filter((o) => o.status === "pending").length,
		suspended: organizations.filter((o) => o.status === "suspended").length,
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="p-4 md:p-6 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold">Organizations</h1>
				<p className="text-muted-foreground">
					Manage platform organizations and tenants
				</p>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">{stats.total}</div>
						<p className="text-sm text-muted-foreground">Total</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold text-green-600">
							{stats.active}
						</div>
						<p className="text-sm text-muted-foreground">Active</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold text-yellow-600">
							{stats.pending}
						</div>
						<p className="text-sm text-muted-foreground">Pending</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold text-red-600">
							{stats.suspended}
						</div>
						<p className="text-sm text-muted-foreground">Suspended</p>
					</CardContent>
				</Card>
			</div>

			{/* Search and Filters */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search organizations..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>
				<div className="flex gap-2">
					<Button
						variant={statusFilter === "all" ? "default" : "outline"}
						size="sm"
						onClick={() => setStatusFilter("all")}
					>
						All
					</Button>
					<Button
						variant={statusFilter === "active" ? "default" : "outline"}
						size="sm"
						onClick={() => setStatusFilter("active")}
					>
						Active
					</Button>
					<Button
						variant={statusFilter === "pending" ? "default" : "outline"}
						size="sm"
						onClick={() => setStatusFilter("pending")}
					>
						Pending
					</Button>
					<Button
						variant={statusFilter === "suspended" ? "default" : "outline"}
						size="sm"
						onClick={() => setStatusFilter("suspended")}
					>
						Suspended
					</Button>
				</div>
			</div>

			{/* Organizations List */}
			<Card>
				<CardHeader>
					<CardTitle>Organizations ({filteredOrgs.length})</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{filteredOrgs.length === 0 ? (
							<p className="text-muted-foreground text-center py-8">
								No organizations found
							</p>
						) : (
							filteredOrgs.map((org) => (
								<OrganizationRow
									key={org.id}
									organization={org}
									onRefresh={mutate}
								/>
							))
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function OrganizationRow({
	organization: org,
	onRefresh,
}: {
	organization: Organization;
	onRefresh: () => void;
}) {
	const { suspendOrganization, isMutating: isSuspending } =
		useSuspendOrganization(org.id);
	const { reactivateOrganization, isMutating: isReactivating } =
		useReactivateOrganization(org.id);

	const handleSuspend = async () => {
		await suspendOrganization();
		onRefresh();
	};

	const handleReactivate = async () => {
		await reactivateOrganization();
		onRefresh();
	};

	return (
		<div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
			<div className="flex items-center gap-4">
				<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
					<Building2 className="h-5 w-5 text-primary" />
				</div>
				<div>
					<p className="font-medium">{org.name}</p>
					<p className="text-sm text-muted-foreground">{org.email}</p>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<Badge className={planColors[org.plan]}>{org.plan}</Badge>
				<Badge className={statusColors[org.status]}>{org.status}</Badge>
				<span className="text-sm text-muted-foreground hidden md:inline">
					{formatDate(org.created_at)}
				</span>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>View Details</DropdownMenuItem>
						<DropdownMenuItem>Contact</DropdownMenuItem>
						{org.status === "active" && (
							<DropdownMenuItem
								className="text-red-600"
								onClick={handleSuspend}
								disabled={isSuspending}
							>
								{isSuspending ? "Suspending..." : "Suspend"}
							</DropdownMenuItem>
						)}
						{org.status === "suspended" && (
							<DropdownMenuItem
								className="text-green-600"
								onClick={handleReactivate}
								disabled={isReactivating}
							>
								{isReactivating ? "Reactivating..." : "Reactivate"}
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
