import { defineConfig } from "@playwright/test";

// Tests run against a static build of the fixture dictionaries in e2e/fixtures.
export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:4173" },
  webServer: {
    command: "DICTIONARIES_DIR=e2e/fixtures next build && serve out -l 4173",
    url: "http://localhost:4173",
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
