export const REFERENCE_DATE = "2026-11-05";
export const BASE =
  "RESERVA CLIENTE=CARLOS HABITACION=H203 FECHA=2026-12-15 NOCHES=3 PERSONAS=2";
const cases = [];
function add(category, inputs) {
  inputs.forEach((input, i) =>
    cases.push({
      id: `${category.toUpperCase()}-${String(i + 1).padStart(2, "0")}`,
      input,
      category,
      expectedValid: category === "valid",
      expectedType: category,
    }),
  );
}
add("valid", [
  BASE,
  BASE.replace("CARLOS", "MARIA"),
  BASE.replace("H203", "H101"),
  BASE.replace("H203", "H504").replace("PERSONAS=2", "PERSONAS=6"),
  BASE.replace("2026-12-15", "2026-11-05"),
  BASE.replace("2026-12-15", "2028-02-29"),
  BASE.replace("NOCHES=3", "NOCHES=1"),
  BASE.replace("PERSONAS=2", "PERSONAS=1"),
  BASE.replaceAll(" ", "\n"),
  BASE.replace("H203", "H301").replace("PERSONAS=2", "PERSONAS=4"),
]);
add("lexical", [
  BASE.replace("CARLOS", "CARLOS@"),
  BASE.replace("CARLOS", "CARLOS_"),
  BASE.replace("CARLOS", "Carlos"),
  BASE + ";",
  BASE + "#",
  BASE.replace("CARLOS", "CARLÓS"),
  BASE.replace("=3", "=+3"),
  BASE.replace("=3", "=3.5"),
  BASE.replace("CARLOS", '"CARLOS"'),
  BASE.replace("H203", "H20$"),
]);
add("syntactic", [
  "",
  BASE.replace("RESERVA ", " "),
  BASE.replace("CLIENTE=", "CLIENTE "),
  BASE.replace("CARLOS", "123"),
  BASE.replace("H203", "H20"),
  BASE.replace("2026-12-15", "2026"),
  BASE.replace(" NOCHES=3", ""),
  BASE.replace(" PERSONAS=2", ""),
  BASE + " PERSONAS=2",
  BASE.replace("NOCHES=3 PERSONAS=2", "PERSONAS=2 NOCHES=3"),
]);
add("semantic", [
  BASE.replace("2026-12-15", "2026-02-30"),
  BASE.replace("2026-12-15", "2026-13-15"),
  BASE.replace("2026-12-15", "2026-12-00"),
  BASE.replace("2026-12-15", "2026-11-04"),
  BASE.replace("NOCHES=3", "NOCHES=0"),
  BASE.replace("PERSONAS=2", "PERSONAS=0"),
  BASE.replace("H203", "H999"),
  BASE.replace("PERSONAS=2", "PERSONAS=3"),
  BASE.replace("H203", "H504").replace("PERSONAS=2", "PERSONAS=7"),
  BASE.replace("NOCHES=3", "NOCHES=9007199254740992"),
]);
export const CASES = Object.freeze(cases);
