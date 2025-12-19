"use client";
import { mockEvents } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { EventDetailClient } from "@/components/event-detail-client";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: PageProps) {
	const { id } = await params;

	const event = mockEvents.find((e) => e.id === id);

	if (!event) {
		notFound();
	}

	return <EventDetailClient event={event} />;
}
