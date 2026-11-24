import { expect, test } from "@playwright/test";

const terms = (page: import("@playwright/test").Page) =>
  page.locator(".card h3").allTextContents();

test("index lists every dictionary and links to it", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Test Dictionary" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Another Dictionary" })).toBeVisible();
  await page.getByRole("link", { name: "Test Dictionary" }).click();
  await expect(page).toHaveURL(/\/test-dictionary$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Test Dictionary");
  await expect(page.getByText("A foreword for testing.")).toBeVisible();
});

test("words are sorted A to Z and the dropdown reverses them", async ({ page }) => {
  await page.goto("/test-dictionary");
  expect(await terms(page)).toEqual(["Apple Pie", "banana", "cherry", "durian"]);
  const sort = page.getByRole("combobox", { name: "Sort" });
  await sort.selectOption("desc");
  expect(await terms(page)).toEqual(["durian", "cherry", "banana", "Apple Pie"]);
  await sort.selectOption("asc");
  expect(await terms(page)).toEqual(["Apple Pie", "banana", "cherry", "durian"]);
});

test("search matches words, definitions and extended definitions", async ({ page }) => {
  await page.goto("/test-dictionary");
  const search = page.getByRole("searchbox", { name: "Search" });
  await search.fill("BANANA");
  expect(await terms(page)).toEqual(["banana"]);
  await search.fill("fruit");
  expect(await terms(page)).toEqual(["banana", "cherry"]);
  await search.fill("cinnamon");
  expect(await terms(page)).toEqual(["Apple Pie"]);
  await search.fill("nothing matches this");
  await expect(page.locator(".card")).toHaveCount(0);
  await expect(page.getByText("0 of 4 words")).toBeVisible();
});

test("unknown pages show the 404 page", async ({ page }) => {
  const res = await page.goto("/no-such-dictionary");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Not found" })).toBeVisible();
});

test("search and sort stay visible while scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 300 });
  await page.goto("/test-dictionary");
  await page.mouse.wheel(0, 2000);
  await expect(page.getByRole("searchbox", { name: "Search" })).toBeInViewport();
  await expect(page.getByRole("combobox", { name: "Sort" })).toBeInViewport();
});

test("draft words without a definition still render", async ({ page }) => {
  await page.goto("/test-dictionary");
  const card = page.locator("#durian");
  await expect(card.getByText("Definition coming soon.")).toBeVisible();
  await expect(card.locator("hr")).toHaveCount(1);
});
