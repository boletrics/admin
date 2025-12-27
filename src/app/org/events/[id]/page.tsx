import { EventDetailView } from "@/components/org/views/event-detail-view";

interface EventPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function EventPage({ params }: EventPageProps) {
	const { id } = await params;
	return <EventDetailView eventId={id} />;
}
