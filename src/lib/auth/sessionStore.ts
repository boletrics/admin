import { atom } from "nanostores";
import type { Session, SessionState } from "./types";

export const sessionStore = atom<SessionState>({
	data: null,
	error: null,
	isPending: true,
});

export function setSession(session: Session) {
	sessionStore.set({ data: session, error: null, isPending: false });
}

export function clearSession() {
	sessionStore.set({ data: null, error: null, isPending: false });
}
