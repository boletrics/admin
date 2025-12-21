import { cookies } from "next/headers";
import { getAuthCoreBaseUrl } from "./config";
import type { Session } from "./types";

export async function getServerSession(): Promise<Session> {
	try {
		const cookieStore = await cookies();
		const response = await fetch(
			`${getAuthCoreBaseUrl()}/api/auth/get-session`,
			{
				headers: { Cookie: cookieStore.toString() },
				cache: "no-store",
			},
		);
		if (!response.ok) return null;
		const data = (await response.json()) as Session | { user?: unknown };
		return data && "user" in data && data.user ? (data as Session) : null;
	} catch {
		return null;
	}
}
