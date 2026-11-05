import fs from "node:fs";
import assert from "node:assert/strict";
import { Builder, By, until, logging } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { preview } from "vite";
import { BASE } from "../src/metrics/cases.js";
fs.mkdirSync("docs/evidence", { recursive: true });
const server = await preview({
  preview: { host: "127.0.0.1", port: 4175, strictPort: true, open: false },
});
const checks = [];
let driver;
try {
  const options = new chrome.Options().addArguments(
    "--headless=new",
    "--window-size=1680,1050",
    "--force-device-scale-factor=1",
  );
  const prefs = new logging.Preferences();
  prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
  driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .setLoggingPrefs(prefs)
    .build();
  await driver.get("http://127.0.0.1:4175");
  await driver.wait(until.elementLocated(By.id("compile")), 10000);
  const setSource = async (value) => {
    const source = await driver.findElement(By.id("source"));
    await source.clear();
    await source.sendKeys(value);
  };
  // Fixed date makes UI acceptance reproducible after the demo dates have passed.
  await driver.executeScript(
    "document.getElementById('referenceDate').value='2026-11-05'",
  );
  await driver.findElement(By.id("compile")).click();
  assert.match(
    await driver.findElement(By.id("status")).getText(),
    /SOLICITUD VÁLIDA/,
  );
  checks.push("valid request");
  assert.equal(
    (await driver.findElements(By.css("#resultPanel tbody tr"))).length,
    16,
  );
  checks.push("16 displayed tokens");
  assert.equal(
    (await driver.findElements(By.css("#traceability tbody tr"))).length,
    20,
  );
  assert.match(await driver.findElement(By.id("nfaTable")).getText(), /n6/);
  assert.match(
    await driver.findElement(By.id("derivationExamples")).getText(),
    /LUIS/,
  );
  checks.push("Word: 20 requirements, NFA n0–n6 and documented derivations");
  for (const [input, expected] of [
    [BASE + "@", "LEX01"],
    [BASE.replace("CLIENTE=", "CLIENTE "), "SYN01"],
    [BASE.replace("NOCHES=3", "NOCHES=0"), "RS03"],
  ]) {
    await setSource(input);
    await driver.findElement(By.id("compile")).click();
    assert.match(
      await driver.findElement(By.id("status")).getText(),
      /SOLICITUD INVÁLIDA/,
    );
    assert.match(
      await driver.findElement(By.id("errors")).getText(),
      new RegExp(expected),
    );
    assert.equal(
      await driver.findElement(By.css("[data-code=json]")).isEnabled(),
      false,
    );
    checks.push(expected + " blocks output");
  }
  await setSource(BASE.replace(" FECHA", "\nFECHA"));
  await driver.findElement(By.id("compile")).click();
  await driver.findElement(By.css("[data-tab=code]")).click();
  await driver.findElement(By.id("showSQL")).click();
  assert.match(
    await driver.findElement(By.id("codeOutput")).getText(),
    /VALUES \(\$1/,
  );
  checks.push("parameterized SQL");
  await driver.findElement(By.id("runTests")).click();
  await driver.wait(
    async () =>
      /100.0 %/.test(
        await driver.findElement(By.id("metricSummary")).getText(),
      ),
    10000,
  );
  checks.push("40-case browser battery");
  await driver.findElement(By.css("[data-tab=lexical]")).click();
  await driver.wait(
    async () => !(await driver.findElement(By.id("toast")).isDisplayed()),
    6000,
  );
  await driver.executeScript(
    "window.scrollTo(0,0);document.getElementById('source').scrollLeft=0;document.activeElement.blur()",
  );
  fs.writeFileSync(
    "docs/evidence/desktop.png",
    await driver.takeScreenshot(),
    "base64",
  );
  await driver.manage().window().setRect({ width: 390, height: 844 });
  await driver.sendDevToolsCommand("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  assert.equal(await driver.executeScript("return window.innerWidth"), 390);
  await driver.executeScript("window.scrollTo(0,0)");
  assert.equal(
    await driver.executeScript(
      "return document.documentElement.scrollWidth <= window.innerWidth",
    ),
    true,
  );
  checks.push("mobile no horizontal overflow");
  await driver.findElement(By.id("menu")).click();
  assert.match(
    await driver.findElement(By.id("sidebar")).getAttribute("class"),
    /open/,
  );
  await driver.findElement(By.id("menu")).click();
  checks.push("mobile navigation");
  await driver.wait(
    async () =>
      await driver.executeScript(
        "return document.getElementById('sidebar').getBoundingClientRect().right <= 0",
      ),
    3000,
  );
  fs.writeFileSync(
    "docs/evidence/mobile.png",
    await driver.takeScreenshot(),
    "base64",
  );
  await driver.findElement(By.id("clear")).click();
  assert.match(
    await driver.findElement(By.id("status")).getText(),
    /PENDIENTE/,
  );
  checks.push("clear invalidates stale results");
  await driver.findElement(By.id("theme")).click();
  assert.match(
    await driver.findElement(By.css("html")).getAttribute("class"),
    /light/,
  );
  checks.push("theme toggle");
  const logs = await driver.manage().logs().get(logging.Type.BROWSER);
  const errors = logs.filter(
    (l) => l.level.name === "SEVERE" && !l.message.includes("favicon.ico"),
  );
  assert.deepEqual(errors, []);
  checks.push("no browser console errors");
  fs.writeFileSync(
    "docs/evidence/selenium.json",
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        browser: await driver.getCapabilities().then((c) => ({
          name: c.get("browserName"),
          version: c.get("browserVersion"),
        })),
        checks,
        passed: checks.length,
      },
      null,
      2,
    ),
  );
  console.log(`Selenium: ${checks.length} checks passed.`);
} finally {
  if (driver) await driver.quit();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
