import fs from "node:fs";
import os from "node:os";
import { evaluate, manualCompile } from "../src/metrics/evaluate.js";
fs.mkdirSync("docs/evidence", { recursive: true });
const antlr = evaluate(),
  manual = evaluate({ engine: manualCompile });
const result = {
  environment: {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    cpu: os.cpus()[0]?.model,
  },
  method:
    "40 warm-ups excluded; 10 repetitions/case; performance.now; pipeline only; same semantic rules for both engines; no human baseline",
  antlr,
  manual,
};
fs.writeFileSync(
  "docs/evidence/benchmark.json",
  JSON.stringify(result, null, 2),
);
console.log(
  JSON.stringify(
    {
      antlr: {
        accuracy: antlr.classificationAccuracy,
        detection: antlr.invalidDetection,
        meanMs: antlr.meanMs,
        consistency: antlr.consistency,
      },
      manual: {
        accuracy: manual.classificationAccuracy,
        meanMs: manual.meanMs,
      },
    },
    null,
    2,
  ),
);
