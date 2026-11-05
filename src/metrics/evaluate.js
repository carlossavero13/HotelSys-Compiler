import { compile } from "../compiler/index.js";
import { Lexer, Parser } from "../reference/legacy.js";
import { validate } from "../semantic/rules.js";
import { CASES, REFERENCE_DATE } from "./cases.js";

// Comparator: original manual recognizers + same current semantic rules.
// This compares two automated implementations, never a human procedure.
export function manualCompile(
  input,
  options = { referenceDate: REFERENCE_DATE },
) {
  const start = performance.now();
  const lexical = new Lexer(input).tokenize();
  let type = "valid",
    ast = null;
  if (lexical.errors.length) type = "lexical";
  else {
    try {
      const data = new Parser(lexical.tokens).parse().data;
      ast = {
        ...data,
        noches: Number(data.noches),
        personas: Number(data.personas),
      };
    } catch {
      type = "syntactic";
    }
    if (ast && validate(ast, options).some((r) => !r.passed)) type = "semantic";
  }
  return {
    valid: type === "valid",
    type,
    elapsed: performance.now() - start,
    ast,
  };
}
export function evaluate({ repetitions = 10, engine = compile } = {}) {
  if (!Number.isInteger(repetitions) || repetitions < 1)
    throw new Error("Repeticiones inválidas");
  const options = { referenceDate: REFERENCE_DATE };
  CASES.forEach((c) => engine(c.input, options)); // warm-up excluded
  const rows = CASES.map((c) => {
    const runs = Array.from({ length: repetitions }, () =>
      engine(c.input, options),
    );
    const first = runs[0];
    const signature = ({ elapsed, ...result }) => JSON.stringify(result);
    return {
      ...c,
      obtainedValid: first.valid,
      obtainedType: first.type,
      passed: runs.every(
        (r) => r.valid === c.expectedValid && r.type === c.expectedType,
      ),
      consistent: runs.every((r) => signature(r) === signature(first)),
      meanMs: runs.reduce((s, r) => s + r.elapsed, 0) / repetitions,
      maxMs: Math.max(...runs.map((r) => r.elapsed)),
      timingsMs: runs.map((r) => r.elapsed),
    };
  });
  return {
    timestamp: new Date().toISOString(),
    environment:
      typeof navigator === "undefined"
        ? `Node ${globalThis.process?.version}`
        : navigator.userAgent,
    referenceDate: REFERENCE_DATE,
    timezone: "America/Lima",
    repetitions,
    warmup: 40,
    samples: 40 * repetitions,
    classificationAccuracy: rows.filter((r) => r.passed).length / 40,
    invalidDetection:
      rows.filter((r) => !r.expectedValid && !r.obtainedValid).length / 30,
    meanMs: rows.reduce((s, r) => s + r.meanMs, 0) / 40,
    maxMs: Math.max(...rows.map((r) => r.maxMs)),
    performanceLimitMs: 2000,
    performancePassed: rows.every((r) => r.maxMs <= 2000),
    consistencyScope: "Resultado completo del pipeline, excepto elapsed",
    consistency: rows.filter((r) => r.consistent).length / 40,
    rows,
  };
}
