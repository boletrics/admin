import { describe, expect, it, beforeEach } from "vitest";
import { sessionStore, setSession, clearSession } from "./sessionStore";
import type { Session } from "./types";

describe("auth/sessionStore", () => {
	beforeEach(() => {
		// Reset store to initial state before each test
		sessionStore.set({
			data: null,
			error: null,
			isPending: true,
		});
	});

	it("initializes with null session and pending state", () => {
		const state = sessionStore.get();
		expect(state.data).toBeNull();
		expect(state.error).toBeNull();
		expect(state.isPending).toBe(true);
	});

	it("setSession updates store with session data", () => {
		const mockSession: Session = {
			user: {
				id: "1",
				name: "Test User",
				email: "test@example.com",
				image: null,
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			session: {
				id: "session-1",
				userId: "1",
				token: "token-123",
				expiresAt: new Date(),
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		};

		setSession(mockSession);

		const state = sessionStore.get();
		expect(state.data).toEqual(mockSession);
		expect(state.error).toBeNull();
		expect(state.isPending).toBe(false);
	});

	it("clearSession resets store to null session", () => {
		const mockSession: Session = {
			user: {
				id: "1",
				name: "Test User",
				email: "test@example.com",
				image: null,
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			session: {
				id: "session-1",
				userId: "1",
				token: "token-123",
				expiresAt: new Date(),
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		};

		setSession(mockSession);
		clearSession();

		const state = sessionStore.get();
		expect(state.data).toBeNull();
		expect(state.error).toBeNull();
		expect(state.isPending).toBe(false);
	});
});
