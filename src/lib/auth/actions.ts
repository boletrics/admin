"use client";

import { authClient } from "./authClient";
import { clearSession } from "./sessionStore";
import { getAuthAppUrl } from "./config";

export async function logout(): Promise<void> {
	const authAppUrl = getAuthAppUrl();
	try {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					clearSession();
					window.location.href = `${authAppUrl}/login`;
				},
			},
		});
	} catch {
		clearSession();
		window.location.href = `${authAppUrl}/login`;
	}
}
