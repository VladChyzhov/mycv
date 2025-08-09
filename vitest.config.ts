import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: [
      "tests/**/*.spec.ts",
      "domain/**/*.test.ts",
    ],
    coverage: {
      enabled: false,
    },
  },
})


