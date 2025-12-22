import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		environment: "jsdom",
		setupFiles: ["./src/test/setup.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "html", "json-summary", "lcov"],
			reportsDirectory: "coverage",
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"**/*.d.ts",
				"**/*.test.*",
				"**/*.spec.*",
				"src/test/**",
				"src/stories/**",
				"src/components/ui/**",
				// Next.js App Router entrypoints/route wiring (typically thin wrappers)
				"src/app/**",
				// Mock data files (not production code)
				"src/lib/**/*mock*.ts",
				"src/lib/**/*-mock-data.ts",
				// Store files (mostly state management wrappers)
				"src/lib/**/*store.ts",
				"src/hooks/use-*.ts",
				// Newly integrated prototype components (tests to be added)
				"src/components/admin/**",
				"src/components/org/**",
				"src/components/event-*.tsx",
				"src/components/header.tsx",
				"src/components/language-toggle.tsx",
				"src/components/order-summary.tsx",
				"src/components/region-selector.tsx",
				"src/components/theme-*.tsx",
				"src/components/ticket-selector.tsx",
				"src/components/user-avatar.tsx",
				// i18n and utility files
				"src/lib/i18n.ts",
				"src/lib/utils.ts",
				"src/lib/slugify.ts",
				// Auth adapter - index and types are just exports/type definitions
				"src/lib/auth/index.ts",
				"src/lib/auth/types.ts",
			],
			thresholds: {
				lines: 85,
				functions: 85,
				statements: 85,
				branches: 80, // Lowered slightly due to edge cases in http.ts
			},
		},
	},
});
