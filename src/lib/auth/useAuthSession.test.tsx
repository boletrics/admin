import { describe, expect, it, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { useAuthSession, SessionHydrator } from "./useAuthSession";
import { sessionStore, setSession } from "./sessionStore";
import type { Session } from "./types";

// Mock nanostores/react to return store value directly
vi.mock("@nanostores/react", () => ({
	useStore: (store: ReturnType<typeof sessionStore>) => store.get(),
}));

describe("auth/useAuthSession", () => {
	beforeEach(() => {
		sessionStore.set({ data: null, error: null, isPending: true });
	});

	it("useAuthSession returns session state", () => {
		const TestComponent = () => {
			const { data, error, isPending } = useAuthSession();
			return (
				<div>
					<span data-testid="data">{data ? "has-data" : "no-data"}</span>
					<span data-testid="error">{error ? "has-error" : "no-error"}</span>
					<span data-testid="pending">{isPending ? "pending" : "not-pending"}</span>
				</div>
			);
		};

		const { getByTestId } = render(<TestComponent />);
		expect(getByTestId("data").textContent).toBe("no-data");
		expect(getByTestId("error").textContent).toBe("no-error");
		expect(getByTestId("pending").textContent).toBe("pending");
	});

	it("useAuthSession returns session when set", () => {
		const mockSession: Session = {
			user: {
				id: "user-1",
				name: "Test User",
				email: "test@example.com",
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			session: {
				id: "session-1",
				userId: "user-1",
				token: "token-123",
				expiresAt: new Date(),
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		};

		setSession(mockSession);

		const TestComponent = () => {
			const { data } = useAuthSession();
			return (
				<div>
					<span data-testid="user-id">{data?.user.id}</span>
				</div>
			);
		};

		const { getByTestId } = render(<TestComponent />);
		expect(getByTestId("user-id").textContent).toBe("user-1");
	});

	it("SessionHydrator hydrates session on client side", () => {
		const mockSession: Session = {
			user: {
				id: "user-1",
				name: "Test User",
				email: "test@example.com",
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			session: {
				id: "session-1",
				userId: "user-1",
				token: "token-123",
				expiresAt: new Date(),
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		};

		// Reset store before hydration
		sessionStore.set({ data: null, error: null, isPending: true });

		const { container } = render(
			<SessionHydrator serverSession={mockSession}>
				<div>Test Content</div>
			</SessionHydrator>,
		);

		expect(container.textContent).toBe("Test Content");

		// Verify session was hydrated
		const state = sessionStore.get();
		expect(state.data).toEqual(mockSession);
		expect(state.isPending).toBe(false);
	});

	it("SessionHydrator only hydrates once", () => {
		const mockSession1: Session = {
			user: {
				id: "user-1",
				name: "Test User",
				email: "test@example.com",
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			session: {
				id: "session-1",
				userId: "user-1",
				token: "token-123",
				expiresAt: new Date(),
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		};

		const mockSession2: Session = {
			user: {
				id: "user-2",
				name: "Other User",
				email: "other@example.com",
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			session: {
				id: "session-2",
				userId: "user-2",
				token: "token-456",
				expiresAt: new Date(),
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		};

		sessionStore.set({ data: null, error: null, isPending: true });

		const { rerender } = render(
			<SessionHydrator serverSession={mockSession1}>
				<div>Test</div>
			</SessionHydrator>,
		);

		// Re-render with different session
		rerender(
			<SessionHydrator serverSession={mockSession2}>
				<div>Test</div>
			</SessionHydrator>,
		);

		// Should still have first session (hydration only happens once)
		const state = sessionStore.get();
		expect(state.data?.user.id).toBe("user-1");
	});
});
