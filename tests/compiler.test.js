import { describe, it, expect } from "vitest";
import { compile, TOKEN_NAMES } from "../src/compiler/index.js";
import { CASES, BASE, REFERENCE_DATE } from "../src/metrics/cases.js";
import { calendarDate, limaDate } from "../src/semantic/rules.js";
const options = { referenceDate: REFERENCE_DATE };
describe("40 solicitudes documentadas", () => {
  for (const c of CASES)
    it(c.id, () => {
      const result = compile(c.input, options);
      expect(result.valid).toBe(c.expectedValid);
      expect(result.type).toBe(c.expectedType);
      expect(!!result.codeGen).toBe(c.expectedValid);
    });
});
describe("Integración y regresiones", () => {
  it("16 tokens, 11 categorías y cinco atributos", () => {
    const r = compile(BASE, options);
    expect(r.tokens).toHaveLength(16);
    expect(new Set(r.tokens.map((t) => t.type))).toEqual(new Set(TOKEN_NAMES));
    expect(Object.keys(r.ast)).toEqual([
      "cliente",
      "habitacion",
      "fecha",
      "noches",
      "personas",
    ]);
  });
  it("posiciones conservan líneas y espacios de entrada", () => {
    const r = compile("  " + BASE.replace(" FECHA", "\nFECHA"), options);
    expect(r.tokens[0]).toMatchObject({ line: 1, column: 3, pos: 2 });
    expect(r.tokens.find((t) => t.type === "TOKEN_FECHA")).toMatchObject({
      line: 2,
      column: 1,
    });
  });
  it("error léxico bloquea AST y salidas aunque ANTLR omita el carácter", () => {
    const r = compile(BASE + "@", options);
    expect(r.ast).toBeNull();
    expect(r.codeGen).toBeNull();
    expect(r.errors[0]).toMatchObject({
      type: "lexical",
      code: "LEX01",
      line: 1,
    });
  });
  it("recuperación sintáctica bloquea AST y salidas", () => {
    const r = compile(BASE.replace("CLIENTE=", "CLIENTE "), options);
    expect(r.ast).toBeNull();
    expect(r.rules).toEqual([]);
    expect(r.codeGen).toBeNull();
  });
  it("Infinity y pérdida de precisión son errores RS03", () => {
    for (const n of ["9".repeat(310), "9007199254740993"]) {
      const r = compile(BASE.replace("NOCHES=3", `NOCHES=${n}`), options);
      expect(r.errors.some((e) => e.code === "RS03")).toBe(true);
      expect(r.codeGen).toBeNull();
    }
  });
  it("catálogo configurable y capacidad exacta", () => {
    expect(compile(BASE, { ...options, rooms: { H203: 1 } }).valid).toBe(false);
    expect(compile(BASE, { ...options, rooms: { H203: 2 } }).valid).toBe(true);
    expect(compile(BASE, { ...options, rooms: {} }).valid).toBe(false);
  });
  it("no atribuye a la fecha un error de noches", () => {
    const r = compile(BASE.replace("NOCHES=3", "NOCHES=0"), options);
    expect(
      r.rules
        .filter((rule) => rule.field === "fecha")
        .every((rule) => rule.passed),
    ).toBe(true);
  });
  it("calendario bisiesto y años 0001–0099", () => {
    expect(calendarDate("2028-02-29")).toBe(true);
    expect(calendarDate("2100-02-29")).toBe(false);
    expect(calendarDate("0001-01-01")).toBe(true);
    expect(calendarDate("0000-01-01")).toBe(false);
  });
  it("zona horaria de Lima independiente del host", () => {
    expect(limaDate(new Date("2026-11-06T02:00:00Z"))).toBe("2026-11-05");
  });
  it("parámetros separados y terminología de solicitud", () => {
    const r = compile(BASE, options);
    expect(r.codeGen.sql).not.toContain("CARLOS");
    expect(r.codeGen.sql).toContain("$6");
    expect(r.codeGen.parameters[0]).toBe("CARLOS");
    expect(JSON.parse(r.codeGen.json).status).toBe("SOLICITUD_VALIDA");
  });
  it("tres derivaciones terminan en los tokens reales", () => {
    for (const c of [CASES[0], CASES[3], CASES[5]]) {
      const r = compile(c.input, options);
      expect(r.derivations.at(-1)).toBe(
        r.tokens.map((t) => t.value).join(" ") + " <EOF>",
      );
      expect(r.derivations).toHaveLength(7);
    }
  });
  it("rechaza nombres alfanuméricos y palabras reservadas como identificador", () => {
    for (const name of ["MARIA99", "RESERVA"])
      expect(compile(BASE.replace("CARLOS", name), options).valid).toBe(false);
  });
  it("errores semánticos incluyen ubicación, fragmento y sugerencia", () => {
    expect(
      compile(BASE.replace("NOCHES=3", "NOCHES=0"), options).errors[0],
    ).toMatchObject({ code: "RS03", fragment: "0", line: 1, column: 64 });
  });
});
