"use client";

import { useState, useMemo } from "react";
import {
	Search,
	MoreHorizontal,
	Mail,
	Shield,
	Ban,
	Key,
	Download,
	UserCheck,
	UserX,
	ShieldCheck,
	Loader2,
} from "lucide-react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	useUsers,
	useBanUser,
	useUnbanUser,
	useSetUserRole,
} from "@/lib/api/hooks";
import type { User } from "@/lib/api/types";

function formatDate(timestamp: string) {
	return new Date(timestamp).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function getRelativeTime(timestamp: string) {
	const now = new Date();
	const then = new Date(timestamp);
	const diffMs = now.getTime() - then.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;
	return formatDate(timestamp);
}

// User status based on banned field from Better Auth
function getUserStatus(user: User): "active" | "banned" {
	return user.banned ? "banned" : "active";
}

const statusConfig: Record<string, { label: string; color: string }> = {
	active: {
		label: "Active",
		color:
			"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
	},
	banned: {
		label: "Banned",
		color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
	},
};

// Role config based on Better Auth role field
const roleConfig: Record<string, { label: string; color: string }> = {
	admin: {
		label: "Admin",
		color:
			"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
	},
	user: {
		label: "User",
		color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
	},
};

export function UsersPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [roleFilter, setRoleFilter] = useState<string>("all");

	// Fetch users from auth-svc
	const {
		data: usersData,
		isLoading,
		error,
		mutate,
	} = useUsers({
		search: searchQuery || undefined,
		role: roleFilter !== "all" ? roleFilter : undefined,
		banned:
			statusFilter === "banned"
				? true
				: statusFilter === "active"
					? false
					: undefined,
	});

	const users = usersData?.data ?? [];

	const filteredUsers = useMemo(() => {
		// Additional client-side filtering if needed
		return users;
	}, [users]);

	const stats = useMemo(() => {
		return {
			total: usersData?.pagination?.total ?? users.length,
			active: users.filter((u) => !u.banned).length,
			verified: users.filter((u) => u.emailVerified).length,
			banned: users.filter((u) => u.banned).length,
		};
	}, [users, usersData]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6">
				<Card className="p-6">
					<p className="text-destructive">
						Failed to load users: {error.message}
					</p>
					<Button onClick={() => mutate()} className="mt-4">
						Retry
					</Button>
				</Card>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Platform Users</h1>
					<p className="text-muted-foreground">
						Manage users across all tenants
					</p>
				</div>
				<Button variant="outline">
					<Download className="h-4 w-4 mr-2" />
					Export Users
				</Button>
			</div>

			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Total Users</CardDescription>
						<CardTitle className="text-2xl">{stats.total}</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription className="flex items-center gap-1">
							<UserCheck className="h-3.5 w-3.5" />
							Active
						</CardDescription>
						<CardTitle className="text-2xl text-emerald-600">
							{stats.active}
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription className="flex items-center gap-1">
							<ShieldCheck className="h-3.5 w-3.5" />
							Verified
						</CardDescription>
						<CardTitle className="text-2xl text-blue-600">
							{stats.verified}
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription className="flex items-center gap-1">
							<UserX className="h-3.5 w-3.5" />
							Banned
						</CardDescription>
						<CardTitle className="text-2xl text-red-600">
							{stats.banned}
						</CardTitle>
					</CardHeader>
				</Card>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-3">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search users..."
						className="pl-9"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-[130px]">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="banned">Banned</SelectItem>
					</SelectContent>
				</Select>
				<Select value={roleFilter} onValueChange={setRoleFilter}>
					<SelectTrigger className="w-[130px]">
						<SelectValue placeholder="Role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Roles</SelectItem>
						<SelectItem value="admin">Admin</SelectItem>
						<SelectItem value="user">User</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Table */}
			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Verified</TableHead>
							<TableHead>Joined</TableHead>
							<TableHead className="w-[50px]"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredUsers.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-8 text-muted-foreground"
								>
									No users found
								</TableCell>
							</TableRow>
						) : (
							filteredUsers.map((user) => {
								const status = getUserStatus(user);
								const role = user.role || "user";
								return (
									<TableRow key={user.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="h-9 w-9">
													{user.image && (
														<AvatarImage
															src={user.image}
															alt={user.name || ""}
														/>
													)}
													<AvatarFallback className="bg-primary/10 text-xs">
														{(user.name || user.email || "U")
															.split(" ")
															.map((n) => n[0])
															.join("")
															.slice(0, 2)
															.toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">
														{user.name || "Unnamed"}
													</p>
													<p className="text-xs text-muted-foreground">
														{user.email}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Badge
												className={
													roleConfig[role]?.color || roleConfig.user.color
												}
											>
												{roleConfig[role]?.label || role}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge className={statusConfig[status].color}>
												{statusConfig[status].label}
											</Badge>
										</TableCell>
										<TableCell>
											{user.emailVerified ? (
												<Shield className="h-4 w-4 text-emerald-500" />
											) : (
												<span className="text-muted-foreground text-xs">
													No
												</span>
											)}
										</TableCell>
										<TableCell className="text-muted-foreground">
											{formatDate(user.createdAt)}
										</TableCell>
										<TableCell>
											<UserActionsMenu user={user} onRefresh={mutate} />
										</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
}

// User actions dropdown menu component
function UserActionsMenu({
	user,
	onRefresh,
}: {
	user: User;
	onRefresh: () => void;
}) {
	const { banUser, isMutating: isBanning } = useBanUser(user.id);
	const { unbanUser, isMutating: isUnbanning } = useUnbanUser(user.id);
	const { setUserRole, isMutating: isSettingRole } = useSetUserRole(user.id);

	const handleBan = async () => {
		await banUser("Banned by admin");
		onRefresh();
	};

	const handleUnban = async () => {
		await unbanUser();
		onRefresh();
	};

	const handleToggleAdmin = async () => {
		const newRole = user.role === "admin" ? "user" : "admin";
		await setUserRole(newRole);
		onRefresh();
	};

	const isLoading = isBanning || isUnbanning || isSettingRole;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" disabled={isLoading}>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem>
					<Mail className="h-4 w-4 mr-2" />
					Send Email
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Key className="h-4 w-4 mr-2" />
					Reset Password
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleToggleAdmin}>
					<Shield className="h-4 w-4 mr-2" />
					{user.role === "admin" ? "Remove Admin" : "Make Admin"}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				{!user.banned ? (
					<DropdownMenuItem className="text-destructive" onClick={handleBan}>
						<Ban className="h-4 w-4 mr-2" />
						Ban User
					</DropdownMenuItem>
				) : (
					<DropdownMenuItem className="text-emerald-600" onClick={handleUnban}>
						<UserCheck className="h-4 w-4 mr-2" />
						Unban User
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
