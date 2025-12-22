"use client";

import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useLocale } from "@/hooks/use-locale";
import { useAuthSession } from "@/lib/auth/useAuthSession";
import { logout } from "@/lib/auth/actions";

export function UserAvatar() {
	const { t } = useLocale();
	const { data: session, isPending } = useAuthSession();

	// Guest avatar (not signed in)
	if (!session || isPending) {
		return (
			<Button variant="ghost" size="icon" asChild className="rounded-full">
				<Link href="/auth">
					<Avatar className="h-9 w-9 border-2 border-dashed border-muted-foreground/40">
						<AvatarFallback className="bg-muted/30">
							<User className="h-5 w-5 text-muted-foreground" />
						</AvatarFallback>
					</Avatar>
				</Link>
			</Button>
		);
	}

	// Signed in avatar - get initials from user name
	const getUserInitials = (name: string) => {
		const parts = name.trim().split(/\s+/);
		if (parts.length >= 2) {
			return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	};

	const initials = getUserInitials(session.user.name);

	const handleLogout = async () => {
		await logout();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full">
					<Avatar className="h-9 w-9 border-2 border-primary">
						<AvatarFallback className="bg-primary text-primary-foreground font-semibold">
							{initials}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{isPending ? "Cargando..." : session?.user?.name || "Usuario"}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{isPending
								? "..."
								: session?.user?.email || "usuario@ejemplo.com"}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/my-tickets">{t("nav.myTickets")}</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={handleLogout}
					className="text-destructive focus:text-destructive"
				>
					{t("nav.signOut")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
