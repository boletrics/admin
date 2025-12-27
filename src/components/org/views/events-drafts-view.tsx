"use client";

import {
	FileText,
	Calendar,
	MapPin,
	Edit,
	Trash,
	Plus,
	Loader2,
	Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEvents } from "@/lib/api/hooks/use-events";
import { apiFetch } from "@/lib/api/client";
import { useOrganizations } from "@/lib/api/hooks/use-organizations";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function EventsDraftsView() {
	const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

	// Fetch draft events
	const {
		data: events = [],
		isLoading,
		error,
		mutate,
	} = useEvents({
		status: "draft",
		include: "venue,dates",
	});

	// Fetch organizations to display org names
	const { data: organizationsData } = useOrganizations();
	const organizations = organizationsData?.data ?? [];

	const getOrgName = (orgId: string) => {
		const org = organizations.find((o) => o.id === orgId);
		return org?.name ?? orgId.slice(0, 8);
	};

	const formatRelativeTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60),
		);

		if (diffInHours < 24) {
			return `Hace ${diffInHours}h`;
		}
		const diffInDays = Math.floor(diffInHours / 24);
		return `Hace ${diffInDays}d`;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-MX", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	const handleDelete = async () => {
		if (!deleteEventId) return;
		try {
			// Use apiFetch directly since hooks can't be called conditionally
			await apiFetch(`/events/${deleteEventId}`, { method: "DELETE" });
			mutate();
			toast.success("Evento eliminado");
			setDeleteEventId(null);
		} catch {
			toast.error("Error al eliminar el evento");
		}
	};

	if (isLoading) {
		return (
			<div className="p-6 flex items-center justify-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6 text-center">
				<p className="text-destructive">Error al cargar los borradores</p>
				<Button variant="outline" className="mt-4" onClick={() => mutate()}>
					Reintentar
				</Button>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Borradores</h1>
					<p className="text-muted-foreground">
						Eventos guardados sin publicar
					</p>
				</div>
				<Button asChild className="gap-2">
					<Link href="/org/events/new">
						<Plus className="h-4 w-4" />
						Nuevo borrador
					</Link>
				</Button>
			</div>

			{events.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<FileText className="h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="font-semibold text-lg mb-2">No hay borradores</h3>
						<p className="text-muted-foreground text-center mb-4">
							Los eventos que guardes sin publicar aparecerán aquí
						</p>
						<Button asChild>
							<Link href="/org/events/new">Crear primer borrador</Link>
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{events.map((event) => (
						<Card key={event.id} className="hover:shadow-md transition-shadow">
							<CardHeader>
								<div className="flex items-start justify-between">
									<Badge variant="secondary" className="mb-2">
										Borrador
									</Badge>
									<span className="text-xs text-muted-foreground">
										{formatRelativeTime(event.updated_at)}
									</span>
								</div>
								<CardTitle className="line-clamp-2">
									<Link
										href={`/org/events/${event.id}`}
										className="hover:text-primary transition-colors"
									>
										{event.title}
									</Link>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2 text-sm text-muted-foreground">
									<div className="flex items-center gap-2">
										<Building2 className="h-4 w-4" />
										<span className="truncate">{getOrgName(event.org_id)}</span>
									</div>
									<div className="flex items-center gap-2">
										<MapPin className="h-4 w-4" />
										<span>{event.venue?.name ?? "Sin lugar"}</span>
									</div>
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4" />
										<span>
											{event.dates?.[0]
												? formatDate(event.dates[0].date)
												: "Sin fecha"}
										</span>
									</div>
								</div>

								<div className="flex gap-2">
									<Button
										variant="outline"
										className="flex-1 gap-2"
										size="sm"
										asChild
									>
										<Link href={`/org/events/${event.id}/edit`}>
											<Edit className="h-4 w-4" />
											Editar
										</Link>
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setDeleteEventId(event.id)}
									>
										<Trash className="h-4 w-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={!!deleteEventId}
				onOpenChange={() => setDeleteEventId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Eliminar borrador?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción no se puede deshacer. El borrador será eliminado
							permanentemente.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Eliminar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
