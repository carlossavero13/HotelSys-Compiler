import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
const jar = "tools/antlr-4.13.2-complete.jar";
fs.mkdirSync("tools", { recursive: true });
if (!fs.existsSync(jar)) {
  const response = await fetch(
    "https://www.antlr.org/download/antlr-4.13.2-complete.jar",
  );
  if (!response.ok) throw new Error(`ANTLR download: ${response.status}`);
  fs.writeFileSync(jar, Buffer.from(await response.arrayBuffer()));
}
let java = process.env.JAVA_HOME
  ? path.join(
      process.env.JAVA_HOME,
      "bin",
      process.platform === "win32" ? "java.exe" : "java",
    )
  : "java";
if (fs.existsSync("tools/jre17")) {
  const folder = fs.readdirSync("tools/jre17")[0];
  java = path.resolve("tools/jre17", folder, "bin/java.exe");
}
const result = spawnSync(
  java,
  [
    "-jar",
    jar,
    "-Dlanguage=JavaScript",
    "-visitor",
    "-o",
    "src/generated",
    "-Xexact-output-dir",
    "grammar/HotelSys.g4",
  ],
  { stdio: "inherit" },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
