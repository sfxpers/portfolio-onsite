import { expect, test } from "@playwright/test";

test("Home → Case Study → next Case Study → Resume → Home", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Shayan - Product Engineer");

  await page.getByRole("link", { name: /EcoBuiltConnect/ }).click();
  await expect(page).toHaveURL(/\/work\/ecobuiltconnect$/);
  await expect(page).toHaveTitle("EcoBuiltConnect case study - Shayan");

  await page.getByRole("link", { name: /Next case study/ }).click();
  await expect(page).toHaveURL(/\/work\/artisanconnect$/);

  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Resume" })
    .click();
  await expect(page).toHaveTitle("Shayan - Resume");

  await page
    .getByRole("banner")
    .getByRole("link", { name: /Shayan/ })
    .click();
  await expect(page).toHaveURL("/");
});

test("Resume shows its sections in order and downloads the PDF under the Identity name", async ({
  page,
}) => {
  await page.goto("/resume");
  await expect(page.getByRole("heading", { level: 2 })).toHaveText([
    "Profile",
    "Recent experience",
    "Selected projects",
    "Skills",
    "Languages",
    "Education",
  ]);

  // The attribute, not suggestedFilename(): Linux WebKit swaps its spaces for underscores.
  const downloadLink = page.getByRole("link", { name: "Download PDF" });
  await expect(downloadLink).toHaveAttribute("download", "Shayan - Product Engineer.pdf");
  const download = page.waitForEvent("download");
  await downloadLink.click();
  await download;

  const pdf = await page.request.get("/resume/download.pdf");
  expect(pdf.headers()["content-type"]).toMatch(/application\/pdf/);
});

test("unknown and retired URLs say so and lead home", async ({ page }) => {
  await page.goto("/work/does-not-exist");
  await expect(
    page.getByRole("heading", { name: /No case study called “does-not-exist”/ }),
  ).toBeVisible();
  await expect(page).toHaveTitle("Case study not found - Shayan");

  for (const path of ["/about", "/resume/ats.html"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
  }
  await page.getByRole("link", { name: "Go to the home page" }).click();
  await expect(page).toHaveURL("/");
});

test("Home fits small phones and keeps location off the Profile", async ({ page }) => {
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 640 });
    await page.goto("/");

    await expect(page.getByRole("region", { name: "Profile" })).not.toContainText("Karachi");
    const scrolls = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(scrolls).toBe(false);
  }
});
