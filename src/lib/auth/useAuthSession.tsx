"use client";

import { useStore } from "@nanostores/react";
import { useRef } from "react";
import type React from "react";
import { sessionStore } from "./sessionStore";
import type { Session } from "./types";

export function useAuthSession() {
	const { data, error, isPending } = useStore(sessionStore);
	return { data, error, isPending };
}

export function SessionHydrator({
	serverSession,
	children,
}: {
	serverSession: Session;
	children: React.ReactNode;
}) {
	const hydrated = useRef(false);
	if (!hydrated.current && typeof window !== "undefined") {
		sessionStore.set({
			data: serverSession,
			error: null,
			isPending: false,
		});
		hydrated.current = true;
	}
	return <>{children}</>;
}
