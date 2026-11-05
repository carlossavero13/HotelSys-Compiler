import { it, expect } from "vitest";
import {
  simulate,
  simulateNFA,
  epsilonClosure,
  nfaTransition,
} from "../src/compiler/automata.js";
import { compile } from "../src/compiler/index.js";
import { WORD_DERIVATIONS } from "../src/metrics/word-examples.js";
import {
  TRACEABILITY,
  WORD_CASE_MAPPING,
} from "../src/metrics/requirements.js";
import { evaluate } from "../src/metrics/evaluate.js";
import { BASE, REFERENCE_DATE } from "../src/metrics/cases.js";
it("AFND del Word: clausura epsilon y ramas pares/impares", () => {
  expect(epsilonClosure(["n1"])).toEqual(["n1", "n2", "n3"]);
  expect(nfaTransition("n2", "2")).toEqual(["n4"]);
  expect(nfaTransition("n3", "2")).toEqual([]);
  expect(nfaTransition("n3", "3")).toEqual(["n4"]);
  expect(nfaTransition("n2", "3")).toEqual([]);
  expect(simulateNFA("H203").subsets).toEqual([
    ["n0"],
    ["n1", "n2", "n3"],
    ["n4"],
    ["n5"],
    ["n6"],
  ]);
  for (let i = 0; i < 1000; i++) {
    const code = "H" + String(i).padStart(3, "0");
    expect(simulateNFA(code).accepted).toBe(simulate(code).accepted);
  }
  expect(simulateNFA("Hε203").accepted).toBe(false);
});
it("tres ejemplos literales construyen árbol sintáctico, independientemente del catálogo", () => {
  for (const input of WORD_DERIVATIONS) {
    const result = compile(input, { referenceDate: REFERENCE_DATE });
    expect(result.ast).not.toBeNull();
    expect(result.errors.every((e) => e.type === "semantic")).toBe(true);
    expect(result.derivations.at(-1)).toBe(
      result.tokens.map((t) => t.value).join(" ") + " <EOF>",
    );
  }
});
it("RF05 y RF08: posición y sugerencia en error sintáctico", () => {
  const r = compile(BASE.replace("CLIENTE=", "CLIENTE "), {
    referenceDate: REFERENCE_DATE,
  });
  expect(r.errors[0]).toMatchObject({
    type: "syntactic",
    line: 1,
    column: 17,
    fragment: "CARLOS",
  });
  expect(r.errors[0].suggestion.length).toBeGreaterThan(10);
});
it("20 requisitos literales y 15 casos representativos vinculados", () => {
  expect(TRACEABILITY).toHaveLength(20);
  expect(TRACEABILITY.filter((r) => r.id.startsWith("RF"))).toHaveLength(12);
  expect(WORD_CASE_MAPPING).toHaveLength(15);
  expect(TRACEABILITY.find((r) => r.id === "RNF01").requirement).toContain(
    "dos segundos",
  );
});
it("RNF01: se conserva el máximo y no se deduce de la media", () => {
  const r = evaluate({
    repetitions: 2,
    engine: () => ({ valid: true, type: "valid", elapsed: 2100 }),
  });
  expect(r.performancePassed).toBe(false);
  expect(r.maxMs).toBe(2100);
  expect(r.rows[0].timingsMs).toEqual([2100, 2100]);
});
it("RNF03 detecta cambios de salida aunque la clasificación coincida", () => {
  let count = 0;
  const r = evaluate({
    repetitions: 2,
    engine: () => ({
      valid: true,
      type: "valid",
      ast: { noches: ++count },
      elapsed: 1,
    }),
  });
  expect(r.consistency).toBe(0);
});
