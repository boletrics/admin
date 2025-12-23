"use client";

import { useState } from "react";
import { Loader2, Search, Filter } from "lucide-react";
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
import { useSupportTickets } from "@/lib/api/hooks";
import type {
	SupportTicketStatus,
	SupportTicketPriority,
} from "@/lib/api/types";

const statusColors: Record<SupportTicketStatus, string> = {
	open: "bg-blue-100 text-blue-700",
	in_progress: "bg-yellow-100 text-yellow-700",
	waiting: "bg-purple-100 text-purple-700",
	resolved: "bg-green-100 text-green-700",
	closed: "bg-gray-100 text-gray-700",
};

const priorityColors: Record<SupportTicketPriority, string> = {
	low: "bg-gray-100 text-gray-700",
	medium: "bg-blue-100 text-blue-700",
	high: "bg-orange-100 text-orange-700",
	critical: "bg-red-100 text-red-700",
};

function formatDate(dateString: string) {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function SupportTicketsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<SupportTicketStatus | "all">(
		"all",
	);

	const { data: ticketsData, isLoading } = useSupportTickets({
		status: statusFilter !== "all" ? statusFilter : undefined,
	});

	const tickets = ticketsData?.data ?? [];

	const filteredTickets = tickets.filter((ticket) =>
		ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()),
	);

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
				<h1 className="text-2xl font-bold">Support Tickets</h1>
				<p className="text-muted-foreground">
					Manage customer support requests
				</p>
			</div>

			{/* Search and Filters */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search tickets..."
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
						variant={statusFilter === "open" ? "default" : "outline"}
						size="sm"
						onClick={() => setStatusFilter("open")}
					>
						Open
					</Button>
					<Button
						variant={statusFilter === "in_progress" ? "default" : "outline"}
						size="sm"
						onClick={() => setStatusFilter("in_progress")}
					>
						In Progress
					</Button>
				</div>
			</div>

			{/* Tickets List */}
			<Card>
				<CardHeader>
					<CardTitle>Tickets ({filteredTickets.length})</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{filteredTickets.length === 0 ? (
							<p className="text-muted-foreground text-center py-8">
								No tickets found
							</p>
						) : (
							filteredTickets.map((ticket) => (
								<div
									key={ticket.id}
									className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
								>
									<div className="space-y-1">
										<p className="font-medium">{ticket.subject}</p>
										<p className="text-sm text-muted-foreground line-clamp-1">
											{ticket.description}
										</p>
										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<span>#{ticket.id.slice(-6)}</span>
											<span>•</span>
											<span>{formatDate(ticket.created_at)}</span>
										</div>
									</div>
									<div className="flex flex-col items-end gap-2">
										<Badge className={statusColors[ticket.status]}>
											{ticket.status.replace("_", " ")}
										</Badge>
										<Badge
											variant="outline"
											className={priorityColors[ticket.priority]}
										>
											{ticket.priority}
										</Badge>
									</div>
								</div>
							))
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
