import { describe, expect, it, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { SessionGuard } from "./session-guard";
import { sessionStore, setSession } from "@/lib/auth/sessionStore";
import type { Session } from "@/lib/auth/types";

// Mock nanostores/react
vi.mock("@nanostores/react", () => ({
	useStore: vi.fn((store: unknown) => {
		if (store && typeof store === "object" && "get" in store) {
			return (store as { get: () => unknown }).get();
		}
		return null;
	}),
}));

// Mock window.location
const mockLocation = { href: "" };
Object.defineProperty(window, "location", {
	value: mockLocation,
	writable: true,
});

vi.mock("@/lib/auth/config", () => ({
	getAuthAppUrl: () => "https://auth.example.com",
}));

describe("SessionGuard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		sessionStore.set({ data: null, error: null, isPending: true });
		mockLocation.href = "";
	});

	it("shows loading state when session is pending", () => {
		sessionStore.set({ data: null, error: null, isPending: true });

		const { container } = render(
			<SessionGuard>
				<div>Protected Content</div>
			</SessionGuard>,
		);

		expect(container.textContent).toContain("Verifying session...");
	});

	it("renders children when valid session exists", () => {
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

		const { container } = render(
			<SessionGuard>
				<div>Protected Content</div>
			</SessionGuard>,
		);

		expect(container.textContent).toContain("Protected Content");
		expect(mockLocation.href).toBe("");
	});

	it("redirects to login when no session exists", () => {
		sessionStore.set({ data: null, error: null, isPending: false });

		render(
			<SessionGuard>
				<div>Protected Content</div>
			</SessionGuard>,
		);

		// Wait for useEffect to run
		setTimeout(() => {
			expect(mockLocation.href).toContain("https://auth.example.com/login");
			expect(mockLocation.href).toContain("redirect_to=");
		}, 0);
	});
});
