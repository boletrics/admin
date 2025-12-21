"use client";

import { useEffect } from "react";
import { useAuthSession } from "@/lib/auth/useAuthSession";
import { getAuthAppUrl } from "@/lib/auth/config";

interface SessionGuardProps {
	children: React.ReactNode;
}

export function SessionGuard({ children }: SessionGuardProps) {
	const { data: session, isPending } = useAuthSession();

	useEffect(() => {
		if (!isPending && !session) {
			const returnUrl = encodeURIComponent(window.location.href);
			const authAppUrl = getAuthAppUrl();
			window.location.href = `${authAppUrl}/login?redirect_to=${returnUrl}`;
		}
	}, [session, isPending]);

	if (isPending) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
					<p className="text-muted-foreground">Verifying session...</p>
				</div>
			</div>
		);
	}

	if (!session) {
		return null; // Redirect is happening
	}

	return <>{children}</>;
}
