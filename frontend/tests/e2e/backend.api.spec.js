import { expect, test } from "@playwright/test";

const apiBaseUrl = process.env.PLAYWRIGHT_API_BASE_URL || "http://localhost:8000";
const STABILITY_RUNS = 10;

test.describe("Backend API Request Validation", () => {
  test("jobs listing endpoint returns paginated payload", async ({ request }) => {
    for (let run = 1; run <= STABILITY_RUNS; run += 1) {
      const response = await request.get(`${apiBaseUrl}/api/jobs/?page_size=5`);
      expect(response.ok()).toBeTruthy();

      const payload = await response.json();
      expect(payload).toHaveProperty("results");
      expect(Array.isArray(payload.results)).toBeTruthy();
      expect(payload).toHaveProperty("count");
    }
  });

  test("jobs stats endpoint returns aggregate payload", async ({ request }) => {
    for (let run = 1; run <= STABILITY_RUNS; run += 1) {
      const response = await request.get(`${apiBaseUrl}/api/jobs/stats/`);
      expect(response.ok()).toBeTruthy();

      const payload = await response.json();
      expect(payload).toBeTruthy();
      expect(typeof payload).toBe("object");
    }
  });

  test("homepage route is reachable on frontend host", async ({ request, baseURL }) => {
    const frontendBase = baseURL || "http://localhost:5173";
    for (let run = 1; run <= STABILITY_RUNS; run += 1) {
      const response = await request.get(`${frontendBase}/homepage`);
      expect(response.ok()).toBeTruthy();
    }
  });
});
