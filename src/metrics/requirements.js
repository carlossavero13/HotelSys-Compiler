import definitions from "./word-requirements.json" with { type: "json" };

// Evidence is scoped to the recorded local/CI runs; not an unrestricted guarantee.
const evidence = {
  RF01: [
    "ui/app.js; index.html",
    "Selenium: valid request; clear invalidates stale results",
    "docs/evidence/selenium.json",
  ],
  RF02: [
    "compiler/index.js; generated/HotelSysLexer.js",
    "compiler.test.js: 16 tokens, 11 categorías",
    "VALID-01; docs/evidence/benchmark.json",
  ],
  RF03: [
    "compiler/index.js",
    "LEXICAL-01…10; bloqueo de AST/salidas",
    "tests/compiler.test.js; benchmark.json",
  ],
  RF04: [
    "grammar/HotelSys.g4; generated/HotelSysParser.js",
    "SYNTACTIC-01…10",
    "tests/compiler.test.js; benchmark.json",
  ],
  RF05: [
    "compiler/index.js: Errors",
    "ubicaciones sintácticas y recuperación",
    "tests/word-alignment.test.js",
  ],
  RF06: [
    "compiler/ast.js; compiler/index.js; ui/app.js",
    "árbol, AST, tres derivaciones literales",
    "tests/compiler.test.js; word-alignment.test.js",
  ],
  RF07: [
    "semantic/rules.js",
    "SEMANTIC-01…10; RS01–RS05",
    "tests/compiler.test.js; benchmark.json",
  ],
  RF08: [
    "compiler/index.js; ui/app.js",
    "LEX01/SYN01/RS03 y sugerencias",
    "tests/word-alignment.test.js; selenium.json",
  ],
  RF09: [
    "codegen/generate.js",
    "SQL parametrizado y bloqueo por errores",
    "tests/compiler.test.js; selenium.json",
  ],
  RF10: [
    "metrics/cases.js; metrics/evaluate.js",
    "40 casos 10/10/10/10 y batería del navegador",
    "tests/metrics.test.js; selenium.json",
  ],
  RF11: [
    "compiler/index.js; metrics/evaluate.js",
    "validez, tiempo por ejecución, máximo y media",
    "docs/evidence/benchmark.json",
  ],
  RF12: [
    "generated/; scripts/generate.mjs",
    "generación oficial y diff reproducible en CI",
    "GitHub Actions: generate + git diff",
  ],
  RNF01: [
    "metrics/evaluate.js",
    "máximo de 400 ejecuciones ≤ 2000 ms",
    "docs/evidence/benchmark.json: maxMs/performancePassed",
  ],
  RNF02: [
    "ui/app.js; ui/styles.css",
    "fases diferenciadas, diagnóstico y teclado",
    "Selenium y revisión visual; sin estudio de usuarios",
  ],
  RNF03: [
    "metrics/evaluate.js",
    "10 repeticiones: resultado completo salvo tiempo",
    "tests/word-alignment.test.js; benchmark.json",
  ],
  RNF04: [
    "grammar/; semantic/; ui/",
    "separación de módulos e imports",
    "Inspección de arquitectura y build",
  ],
  RNF05: [
    "scripts/selenium.mjs",
    "Selenium Chromium y Firefox",
    "docs/evidence/selenium.json; docs/evidence/firefox.json",
  ],
  RNF06: [
    "compiler/index.js; codegen/generate.js",
    "errores bloquean salidas; SQL sin ejecución",
    "tests/compiler.test.js; inspección del generador",
  ],
  RNF07: [
    "vercel.json; vite.config.js",
    "build + estado Vercel del commit 89ecf31",
    "Vercel Deployment has completed; GitHub Actions",
  ],
  RNF08: [
    "compiler/; semantic/; ui/",
    "arquitectura modular; evaluación de extensión pendiente",
    "La UI mantiene cinco campos/etapas explícitos",
  ],
};
export const TRACEABILITY = definitions.map(({ id, requirement }) => ({
  id,
  requirement,
  module: evidence[id][0],
  test: evidence[id][1],
  evidence: evidence[id][2],
  status:
    id === "RNF08"
      ? "Parcial: extensión no ensayada"
      : "Verificado en el alcance documentado",
  verified: id !== "RNF08",
  source: id.startsWith("RNF") ? "Word §1.2" : "Word §1.1",
}));
export function requirementSummary() {
  const verified = TRACEABILITY.filter((r) => r.verified).length;
  return {
    verified,
    total: TRACEABILITY.length,
    percentage: (verified / TRACEABILITY.length) * 100,
  };
}

// Correspondencia de los casos representativos del Word con la batería de 40.
export const WORD_CASE_MAPPING = [
  ["CP01", "Todos los campos correctos", "VALID-01"],
  ["CP02", "Identificador válido", "VALID-02"],
  ["CP03", "Código H203", "VALID-01"],
  ["CP04", "Carácter @", "LEXICAL-01"],
  ["CP05", "Carácter #", "LEXICAL-05"],
  ["CP06", "Falta =", "SYNTACTIC-03"],
  ["CP07", "Falta campo obligatorio", "SYNTACTIC-07"],
  ["CP08", "Orden incorrecto", "SYNTACTIC-10"],
  ["CP09", "Fecha inexistente", "SEMANTIC-01"],
  ["CP10", "Fecha anterior", "SEMANTIC-04"],
  ["CP11", "NOCHES=0", "SEMANTIC-05"],
  ["CP12", "PERSONAS=0", "SEMANTIC-06"],
  ["CP13", "Habitación inexistente", "SEMANTIC-07"],
  ["CP14", "Exceso de ocupantes", "SEMANTIC-08"],
  ["CP15", "JSON y SQL correctos", "VALID-01 + prueba de parámetros"],
];
