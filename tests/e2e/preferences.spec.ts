import { expect, test } from "@playwright/test";

test("follows the OS colour scheme, with no toggle", async ({ page }) => {
  const background = async (colorScheme: "light" | "dark") => {
    await page.emulateMedia({ colorScheme });
    return page.locator("body").evaluate((el) => getComputedStyle(el).backgroundColor);
  };

  await page.goto("/");
  expect(await background("light")).not.toBe(await background("dark"));
  await expect(page.getByRole("button", { name: /theme|dark|light/i })).toHaveCount(0);
});

test("sparse UI transitions collapse under prefers-reduced-motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const workLink = page.getByRole("link", { name: /EcoBuiltConnect/ });
  const durations = await workLink.evaluate((el) =>
    getComputedStyle(el).transitionDuration.split(",").map(Number.parseFloat),
  );
  for (const duration of durations) {
    expect(duration).toBeLessThanOrEqual(0.01);
  }
});
