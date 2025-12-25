"use client";

import {
	useApiQuery,
	useApiMutation,
	buildQueryString,
	revalidate,
} from "../client";
import type {
	SupportTicket,
	SupportTicketMessage,
	SupportTicketsQueryParams,
	CreateSupportTicketMessageInput,
	UpdateSupportTicketInput,
	PaginatedResult,
} from "../types";

// ============================================================================
// Support Tickets Hooks
// ============================================================================

/**
 * Fetch all support tickets.
 */
export function useSupportTickets(params: SupportTicketsQueryParams = {}) {
	const queryString = buildQueryString(params);
	return useApiQuery<PaginatedResult<SupportTicket>>(
		`/support-tickets${queryString}`,
	);
}

/**
 * Fetch open support tickets.
 */
export function useOpenSupportTickets(
	params: Omit<SupportTicketsQueryParams, "status"> = {},
) {
	const queryString = buildQueryString({ ...params, status: "open" });
	return useApiQuery<PaginatedResult<SupportTicket>>(
		`/support-tickets${queryString}`,
	);
}

/**
 * Fetch support tickets assigned to me.
 */
export function useMyAssignedTickets(
	adminUserId: string | null,
	params: Omit<SupportTicketsQueryParams, "assignee_id"> = {},
) {
	const queryString = buildQueryString({
		...params,
		assignee_id: adminUserId ?? undefined,
	});
	return useApiQuery<PaginatedResult<SupportTicket>>(
		adminUserId ? `/support-tickets${queryString}` : null,
	);
}

/**
 * Fetch a single support ticket by ID.
 */
export function useSupportTicket(ticketId: string | null) {
	return useApiQuery<SupportTicket>(
		ticketId
			? `/support-tickets/${ticketId}?include=messages,user,organization`
			: null,
	);
}

// ============================================================================
// Support Ticket Mutations
// ============================================================================

/**
 * Update a support ticket (status, priority, assignee).
 */
export function useUpdateSupportTicket(ticketId: string) {
	const mutation = useApiMutation<SupportTicket, UpdateSupportTicketInput>(
		`/support-tickets/${ticketId}`,
		"PUT",
	);

	const updateTicket = async (data: UpdateSupportTicketInput) => {
		const result = await mutation.trigger(data);
		revalidate(`/support-tickets/${ticketId}`);
		revalidate(/\/support-tickets/);
		return result;
	};

	return {
		...mutation,
		updateTicket,
	};
}

/**
 * Assign a ticket to an admin.
 */
export function useAssignSupportTicket(ticketId: string) {
	const mutation = useApiMutation<SupportTicket, { assignee_id: string }>(
		`/support-tickets/${ticketId}`,
		"PUT",
	);

	const assignTicket = async (assigneeId: string) => {
		const result = await mutation.trigger({ assignee_id: assigneeId });
		revalidate(`/support-tickets/${ticketId}`);
		revalidate(/\/support-tickets/);
		return result;
	};

	return {
		...mutation,
		assignTicket,
	};
}

/**
 * Close a support ticket.
 */
export function useCloseSupportTicket(ticketId: string) {
	const mutation = useApiMutation<SupportTicket, { status: "closed" }>(
		`/support-tickets/${ticketId}`,
		"PUT",
	);

	const closeTicket = async () => {
		const result = await mutation.trigger({ status: "closed" });
		revalidate(`/support-tickets/${ticketId}`);
		revalidate(/\/support-tickets/);
		return result;
	};

	return {
		...mutation,
		closeTicket,
	};
}

/**
 * Resolve a support ticket.
 */
export function useResolveSupportTicket(ticketId: string) {
	const mutation = useApiMutation<SupportTicket, { status: "resolved" }>(
		`/support-tickets/${ticketId}`,
		"PUT",
	);

	const resolveTicket = async () => {
		const result = await mutation.trigger({ status: "resolved" });
		revalidate(`/support-tickets/${ticketId}`);
		revalidate(/\/support-tickets/);
		return result;
	};

	return {
		...mutation,
		resolveTicket,
	};
}

// ============================================================================
// Support Ticket Messages
// ============================================================================

/**
 * Add a message to a support ticket.
 */
export function useAddSupportTicketMessage(ticketId: string) {
	const mutation = useApiMutation<
		SupportTicketMessage,
		CreateSupportTicketMessageInput
	>(`/support-tickets/${ticketId}/messages`, "POST");

	const addMessage = async (content: string) => {
		const result = await mutation.trigger({ content });
		revalidate(`/support-tickets/${ticketId}`);
		return result;
	};

	return {
		...mutation,
		addMessage,
	};
}

// ============================================================================
// Support Ticket Stats
// ============================================================================

export interface SupportTicketStats {
	total: number;
	open: number;
	in_progress: number;
	resolved: number;
	closed: number;
	by_priority: Record<string, number>;
	by_category: Record<string, number>;
	average_resolution_time_hours: number;
}

export function useSupportTicketStats() {
	return useApiQuery<SupportTicketStats>("/support-tickets/stats");
}
