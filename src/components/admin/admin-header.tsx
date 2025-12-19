"use client";

import { Bell, Search, Shield, AlertTriangle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export function AdminHeader() {
	return (
		<header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
			<SidebarTrigger className="-ml-1" />
			<Separator orientation="vertical" className="mr-2 h-4" />

			{/* Logo */}
			<div className="flex items-center gap-2 mr-4">
				<Shield className="h-5 w-5 text-primary" />
				<span className="font-semibold hidden sm:inline">Admin Console</span>
			</div>

			{/* Search */}
			<div className="flex-1 max-w-md">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Search tenants, tickets, users..."
						className="pl-9 h-9"
					/>
				</div>
			</div>

			<div className="flex items-center gap-2 ml-auto">
				{/* System Status Indicator */}
				<div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
					<span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
					<span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
						All Systems Operational
					</span>
				</div>

				{/* Alerts */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="relative">
							<AlertTriangle className="h-5 w-5 text-amber-500" />
							<Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-amber-500">
								2
							</Badge>
							<span className="sr-only">System Alerts</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-80">
						<DropdownMenuLabel>System Alerts</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="flex flex-col items-start gap-1">
							<div className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-amber-500" />
								<p className="font-medium">Email Service Degraded</p>
							</div>
							<p className="text-sm text-muted-foreground">
								Higher than normal latency detected
							</p>
							<p className="text-xs text-muted-foreground">
								Started 2 hours ago
							</p>
						</DropdownMenuItem>
						<DropdownMenuItem className="flex flex-col items-start gap-1">
							<div className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-amber-500" />
								<p className="font-medium">High Ticket Volume</p>
							</div>
							<p className="text-sm text-muted-foreground">
								23 open tickets, 5 critical priority
							</p>
							<p className="text-xs text-muted-foreground">
								Updated 10 minutes ago
							</p>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Notifications */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="relative">
							<Bell className="h-5 w-5" />
							<Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
								5
							</Badge>
							<span className="sr-only">Notifications</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-80">
						<DropdownMenuLabel>Notifications</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="flex flex-col items-start gap-1">
							<p className="font-medium">New tenant registration</p>
							<p className="text-sm text-muted-foreground">
								Nuevo Promotor MX awaiting approval
							</p>
							<p className="text-xs text-muted-foreground">5 minutes ago</p>
						</DropdownMenuItem>
						<DropdownMenuItem className="flex flex-col items-start gap-1">
							<p className="font-medium">Critical ticket opened</p>
							<p className="text-sm text-muted-foreground">
								Payment processing error - OCESA
							</p>
							<p className="text-xs text-muted-foreground">2 hours ago</p>
						</DropdownMenuItem>
						<DropdownMenuItem className="flex flex-col items-start gap-1">
							<p className="font-medium">MRR milestone reached</p>
							<p className="text-sm text-muted-foreground">
								Platform exceeded $480k MRR
							</p>
							<p className="text-xs text-muted-foreground">Yesterday</p>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-center justify-center font-medium">
							View all notifications
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<ThemeToggle />
			</div>
		</header>
	);
}
