import { createAuthClient } from "better-auth/client";
import { getAuthCoreBaseUrl } from "./config";

export const authClient = createAuthClient({
	baseURL: getAuthCoreBaseUrl(),
	fetchOptions: { credentials: "include" },
});
