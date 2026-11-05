import fs from "node:fs";
import assert from "node:assert/strict";
import { Builder, By, until } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox.js";
import { preview } from "vite";
import { CASES } from "../src/metrics/cases.js";
const server = await preview({
  preview: { host: "127.0.0.1", port: 4176, strictPort: true, open: false },
});
let driver;
try {
  driver = await new Builder()
    .withCapabilities({ browserName: "firefox", browserVersion: "stable" })
    .setFirefoxOptions(new firefox.Options().addArguments("-headless"))
    .build();
  await driver.get("http://127.0.0.1:4176");
  await driver.wait(until.elementLocated(By.id("compile")), 15000);
  await driver.executeScript(
    "document.getElementById('referenceDate').value='2026-11-05'",
  );
  const rows = [];
  for (const c of CASES) {
    await driver.executeScript(
      "const e=document.getElementById('source');e.value=arguments[0];e.dispatchEvent(new Event('input',{bubbles:true}));",
      c.input,
    );
    await driver.findElement(By.id("compile")).click();
    const text = await driver.findElement(By.id("status")).getText();
    assert.ok(
      text.includes(
        c.expectedValid ? "SOLICITUD VÁLIDA" : "SOLICITUD INVÁLIDA",
      ),
      c.id,
    );
    rows.push({ id: c.id, passed: true });
  }
  await driver.findElement(By.id("runTests")).click();
  await driver.wait(
    async () =>
      /100.0 %/.test(
        await driver.findElement(By.id("metricSummary")).getText(),
      ),
    10000,
  );
  const caps = await driver.getCapabilities();
  fs.writeFileSync(
    "docs/evidence/firefox.json",
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        browser: {
          name: caps.get("browserName"),
          version: caps.get("browserVersion"),
        },
        rows,
        batteryPassed: true,
      },
      null,
      2,
    ),
  );
  console.log("Firefox: 40 entradas y batería de métricas aprobadas.");
} finally {
  if (driver) await driver.quit();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
