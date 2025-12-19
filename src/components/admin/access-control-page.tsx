"use client";

import { useState } from "react";
import {
	Shield,
	Users,
	Key,
	Plus,
	MoreHorizontal,
	CheckCircle,
	Eye,
	Pencil,
	Trash2,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { mockAdminUsers } from "@/lib/admin-mock-data";

const roles = [
	{
		id: "super_admin",
		name: "Super Admin",
		description: "Full system access with all permissions",
		permissions: ["all"],
		userCount: 1,
	},
	{
		id: "admin",
		name: "Admin",
		description: "Manage tenants, users, and support tickets",
		permissions: [
			"tenants:manage",
			"users:manage",
			"tickets:manage",
			"analytics:view",
		],
		userCount: 2,
	},
	{
		id: "support",
		name: "Support",
		description: "Handle support tickets and view tenant info",
		permissions: ["tenants:view", "users:view", "tickets:manage"],
		userCount: 3,
	},
	{
		id: "viewer",
		name: "Viewer",
		description: "Read-only access to dashboards",
		permissions: ["analytics:view", "tenants:view"],
		userCount: 1,
	},
];

const permissionGroups = [
	{
		name: "Tenants",
		permissions: [
			{ id: "tenants:view", label: "View tenants" },
			{ id: "tenants:manage", label: "Manage tenants" },
			{ id: "tenants:delete", label: "Delete tenants" },
		],
	},
	{
		name: "Users",
		permissions: [
			{ id: "users:view", label: "View users" },
			{ id: "users:manage", label: "Manage users" },
			{ id: "users:delete", label: "Delete users" },
		],
	},
	{
		name: "Tickets",
		permissions: [
			{ id: "tickets:view", label: "View tickets" },
			{ id: "tickets:manage", label: "Manage tickets" },
		],
	},
	{
		name: "Analytics",
		permissions: [
			{ id: "analytics:view", label: "View analytics" },
			{ id: "analytics:export", label: "Export data" },
		],
	},
	{
		name: "Settings",
		permissions: [
			{ id: "settings:view", label: "View settings" },
			{ id: "settings:manage", label: "Manage settings" },
		],
	},
];

const roleConfig = {
	super_admin: {
		label: "Super Admin",
		color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
	},
	admin: {
		label: "Admin",
		color:
			"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
	},
	support: {
		label: "Support",
		color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	},
	viewer: {
		label: "Viewer",
		color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
	},
};

export function AccessControlPage() {
	const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Access Control</h1>
					<p className="text-muted-foreground">
						Manage admin users, roles, and permissions
					</p>
				</div>
				<Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="h-4 w-4 mr-2" />
							Invite Admin
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Invite Admin User</DialogTitle>
							<DialogDescription>
								Send an invitation to a new administrator
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label>Email Address</Label>
								<Input type="email" placeholder="admin@example.com" />
							</div>
							<div className="space-y-2">
								<Label>Role</Label>
								<Select defaultValue="support">
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="admin">Admin</SelectItem>
										<SelectItem value="support">Support</SelectItem>
										<SelectItem value="viewer">Viewer</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setInviteDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button onClick={() => setInviteDialogOpen(false)}>
								Send Invitation
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Total Admin Users</CardDescription>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{mockAdminUsers.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Active Roles</CardDescription>
						<Shield className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{roles.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Active Sessions</CardDescription>
						<Key className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">3</div>
					</CardContent>
				</Card>
			</div>

			{/* Admin Users */}
			<Card>
				<CardHeader>
					<CardTitle>Admin Users</CardTitle>
					<CardDescription>Users with administrative access</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Last Login</TableHead>
								<TableHead className="w-[50px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{mockAdminUsers.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="h-9 w-9">
												<AvatarFallback className="bg-primary/10">
													{user.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium">{user.name}</p>
												<p className="text-xs text-muted-foreground">
													{user.email}
												</p>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge className={roleConfig[user.role].color}>
											{roleConfig[user.role].label}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge variant="outline" className="text-emerald-600">
											<CheckCircle className="h-3 w-3 mr-1" />
											Active
										</Badge>
									</TableCell>
									<TableCell className="text-muted-foreground">
										{new Date(user.lastLoginAt).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>
													<Eye className="h-4 w-4 mr-2" />
													View Profile
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Pencil className="h-4 w-4 mr-2" />
													Edit Role
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem className="text-destructive">
													<Trash2 className="h-4 w-4 mr-2" />
													Remove
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Roles */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Roles & Permissions</CardTitle>
							<CardDescription>
								Define access levels for admin users
							</CardDescription>
						</div>
						<Button variant="outline" size="sm">
							<Plus className="h-4 w-4 mr-2" />
							Create Role
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{roles.map((role) => (
							<div
								key={role.id}
								className="flex items-center justify-between p-4 border rounded-lg"
							>
								<div className="flex items-center gap-4">
									<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
										<Shield className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h4 className="font-medium">{role.name}</h4>
										<p className="text-sm text-muted-foreground">
											{role.description}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<Badge variant="secondary">{role.userCount} users</Badge>
									<Button variant="ghost" size="sm">
										Edit
									</Button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
