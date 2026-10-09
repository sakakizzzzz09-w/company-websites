// 一時的な架空データで実ページを検証し、必ず元の未掲載データへ戻す。
import fs from "node:fs";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import ts from "typescript";
const {
  default: { chromium },
} = await import(
  pathToFileURL(createRequire(import.meta.url).resolve("playwright")).href
);
import { spawn } from "node:child_process";
const path = "src/lib/members.ts";
const original = fs.readFileSync(path, "utf8");
const fixture = {
  id: "test-only",
  slug: "test-only",
  name: "検証用スタッフ（架空）",
  nickname: "TEST",
  role: "STAFF",
  introduction: "テスト専用の自己紹介",
  favoriteFlavors: ["テストフレーバー"],
  recommendedMix: "テストミックス",
  socials: {
    instagram: "https://www.instagram.com/explore/",
    tiktok: "https://www.tiktok.com/discover",
    x: "https://x.com/explore",
  },
  publication: { consent: true, status: "published" },
  order: 2,
};
const fixtures = [
  fixture,
  {
    ...fixture,
    id: "no-social",
    slug: "no-social",
    name: "SNS未登録テスト",
    socials: {
      instagram: "javascript:alert(1)",
      tiktok: "https://example.invalid/profile",
      x: "",
    },
    photo: "/images/cafe.svg",
    order: 1,
  },
  {
    ...fixture,
    id: "private",
    slug: "private",
    name: "非公開テスト",
    publication: { consent: false, status: "published" },
  },
  {
    ...fixture,
    id: "draft",
    slug: "draft",
    name: "下書きテスト",
    publication: { consent: true, status: "draft" },
  },
];
let server, browser;
(async () => {
  try {
    const source = ts.createSourceFile(path, original, ts.ScriptTarget.Latest, true);
    const declaration = source.statements
      .filter(ts.isVariableStatement)
      .flatMap((statement) => [...statement.declarationList.declarations])
      .find((item) => item.name.getText(source) === "membersByStore");
    const storeProperty = declaration?.initializer?.properties.find(
      (property) => property.name?.text === "chill-chiba",
    );
    assert(storeProperty, "Chill Chibaのデータ項目が必要です");
    fs.writeFileSync(
      path,
      original.slice(0, storeProperty.initializer.getStart(source)) +
        JSON.stringify(fixtures) +
        original.slice(storeProperty.initializer.end),
    );
    server = spawn(
      "npm",
      ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", "3100"],
      { stdio: "ignore", detached: true },
    );
    let ready = false;
    for (let i = 0; i < 60; i++) {
      try {
        const r = await fetch(
          "http://127.0.0.1:3100/stores/chill-chiba/members",
        );
        if (r.ok) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 500));
    }
    assert(ready, "test server did not start");
    browser = await chromium.launch({
      headless: true,
      ...(process.env.CHROMIUM_PATH
        ? { executablePath: process.env.CHROMIUM_PATH }
        : fs.existsSync("/usr/bin/chromium")
          ? { executablePath: "/usr/bin/chromium" }
          : {}),
    });
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    await page
      .context()
      .route(
        /^https:\/\/(www\.)?(instagram\.com|tiktok\.com|x\.com)\//,
        (route) =>
          route.fulfill({
            status: 200,
            contentType: "text/html",
            body: "<p>External navigation test</p>",
          }),
      );
    await page.goto("http://127.0.0.1:3100/stores/chill-chiba");
    await page.getByRole("link", { name: /OUR MEMBERS/ }).click();
    await page.waitForURL("**/members");
    await page.waitForFunction(
      () =>
        getComputedStyle(document.querySelector(".member-socials a"))
          .minHeight === "48px",
      null,
      { timeout: 10000 },
    );
    assert.equal(await page.locator(".member-card").count(), 2);
    assert.match(
      await page.locator(".member-card").first().innerText(),
      /SNS未登録/,
    );
    assert.equal(
      await page
        .locator(".member-card")
        .first()
        .locator(".member-socials a")
        .count(),
      0,
    );
    const card = page.locator(".member-card").nth(1);
    assert.equal(await card.locator(".member-socials a").count(), 3);
    for (const link of await card.locator(".member-socials a").all()) {
      assert.equal(await link.getAttribute("target"), "_blank");
      assert.match(await link.getAttribute("rel"), /noopener/);
      const box = await link.boundingBox();
      assert(box.width >= 48 && box.height >= 48, JSON.stringify(box));
    }
    for (const link of await card.locator(".member-socials a").all()) {
      const href = await link.getAttribute("href");
      const [popup] = await Promise.all([
        page.waitForEvent("popup"),
        link.click(),
      ]);
      await popup.waitForURL(href);
      assert.equal(popup.url(), href);
      assert(page.url().endsWith("/members"));
      await popup.close();
    }
    for (const selector of [
      'a[aria-label$="プロフィールを見る"]',
      "h2 a",
      ".member-button",
    ]) {
      await page.locator(".member-card").nth(1).locator(selector).click();
      await page.waitForURL("**/members/test-only");
      assert.equal(await page.locator("h1").innerText(), fixture.name);
      await page.getByRole("link", { name: "← OUR MEMBERS" }).click();
      await page.waitForURL("**/members");
    }
    await page.goto(
      "http://127.0.0.1:3100/stores/chill-chiba/members/no-social",
    );
    assert.equal(
      await page
        .locator(".member-photo")
        .evaluate((image) => image.complete && image.naturalWidth > 0),
      true,
    );
    await page.goto(
      "http://127.0.0.1:3100/stores/chill-chiba/members/test-only",
    );
    assert.match(await page.title(), /検証用スタッフ.*Chill Chiba/);
    assert.match(
      await page.locator('meta[name="description"]').getAttribute("content"),
      /テスト専用/,
    );
    assert.equal(
      await page.locator(".member-profile .member-socials a").count(),
      3,
    );
    assert.match(
      await page.locator(".member-details").innerText(),
      /テストミックス/,
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await page.getByRole("link", { name: "Chill Chibaへ戻る" }).click();
    await page.waitForURL("**/stores/chill-chiba");
    for (const route of [
      "/stores/chill-chiba/members/private",
      "/stores/chill-chiba/members/draft",
      "/stores/aoyama-coffee/members/test-only",
      "/stores/chill-chiba/members/missing",
    ]) {
      const r = await page.goto("http://127.0.0.1:3100" + route);
      assert.equal(r.status(), 404, route);
    }
    await page.goto("http://127.0.0.1:3100/stores/aoyama-coffee/members");
    assert.match(await page.locator(".members-empty").innerText(), /準備中/);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("http://127.0.0.1:3100/stores/chill-chiba/members");
    assert.equal(
      await page.evaluate(
        () =>
          getComputedStyle(document.querySelector(".members-shell"))
            .backgroundColor,
      ),
      "rgb(16, 13, 12)",
    );
    console.log(
      "PASS: mobile/desktop, list ordering, consent/drafts, store isolation, photo/name/PROFILE navigation, direct profile URL, SEO, empty state, SNS popup/targets/48px taps, store return, 404.",
    );
  } finally {
    fs.writeFileSync(path, original);
    if (browser) await browser.close();
    if (server) {
      try {
        process.kill(-server.pid, "SIGTERM");
      } catch (e) {
        if (e.code !== "ESRCH") throw e;
      }
    }
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
