import { describe, expect, it, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuthSession, SessionHydrator } from "./useAuthSession";
import { sessionStore } from "./sessionStore";
import type { Session } from "./types";
import { render } from "@testing-library/react";

describe("auth/useAuthSession", () => {
	beforeEach(() => {
		// Reset store to initial state before each test
		sessionStore.set({
			data: null,
			error: null,
			isPending: true,
		});
	});

	describe("useAuthSession hook", () => {
		it("returns initial pending state", () => {
			const { result } = renderHook(() => useAuthSession());
			expect(result.current.isPending).toBe(true);
			expect(result.current.data).toBeNull();
			expect(result.current.error).toBeNull();
		});

		it("returns session data when available", () => {
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

			sessionStore.set({
				data: mockSession,
				error: null,
				isPending: false,
			});

			const { result } = renderHook(() => useAuthSession());
			expect(result.current.data).toEqual(mockSession);
			expect(result.current.isPending).toBe(false);
		});
	});

	describe("SessionHydrator component", () => {
		it("renders children", () => {
			const { container } = render(
				<SessionHydrator serverSession={null}>
					<div>Test Content</div>
				</SessionHydrator>,
			);
			expect(container.textContent).toContain("Test Content");
		});

		it("hydrates session store on mount", () => {
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

			render(
				<SessionHydrator serverSession={mockSession}>
					<div>Test</div>
				</SessionHydrator>,
			);

			const state = sessionStore.get();
			expect(state.data).toEqual(mockSession);
			expect(state.isPending).toBe(false);
		});
	});
});
