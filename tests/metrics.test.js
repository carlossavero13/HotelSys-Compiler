import { it, expect } from "vitest";
import { CASES } from "../src/metrics/cases.js";
import { evaluate, manualCompile } from "../src/metrics/evaluate.js";
it("distribución exacta 10/10/10/10 e identificadores únicos", () => {
  expect(new Set(CASES.map((c) => c.id)).size).toBe(40);
  for (const category of ["valid", "lexical", "syntactic", "semantic"])
    expect(CASES.filter((c) => c.category === category)).toHaveLength(10);
});
it("métricas derivadas de ejecuciones reales", () => {
  const r = evaluate();
  expect(r.samples).toBe(400);
  expect(r.rows).toHaveLength(40);
  expect(r.classificationAccuracy).toBe(1);
  expect(r.invalidDetection).toBe(1);
  expect(r.consistency).toBe(1);
  expect(r.meanMs).toBeGreaterThan(0);
});
it("comparador manual conserva sus discrepancias de lenguaje", () => {
  const r = evaluate({ engine: manualCompile, repetitions: 1 });
  expect(r.classificationAccuracy).toBeLessThan(1);
});
