export const DEFAULT_ROOMS = Object.freeze({
  H101: 2,
  H102: 2,
  H203: 2,
  H204: 2,
  H301: 4,
  H302: 4,
  H401: 4,
  H402: 4,
  H503: 6,
  H504: 6,
});
export function limaDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export function calendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(0);
  date.setUTCFullYear(y, m - 1, d);
  date.setUTCHours(0, 0, 0, 0);
  return (
    y > 0 &&
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}
export function validate(
  ast,
  { referenceDate = limaDate(), rooms = DEFAULT_ROOMS } = {},
) {
  if (!calendarDate(referenceDate))
    throw new Error("La fecha de referencia debe ser una fecha ISO válida.");
  if (
    !rooms ||
    typeof rooms !== "object" ||
    Object.entries(rooms).some(
      ([key, value]) =>
        !/^H\d{3}$/.test(key) || !Number.isSafeInteger(value) || value < 1,
    )
  )
    throw new Error(
      "El catálogo requiere códigos H000 y capacidades enteras positivas.",
    );
  const exists = calendarDate(ast.fecha);
  const definitions = [
    [
      "RS01",
      "fecha",
      exists,
      "La fecha existe en el calendario.",
      "Introduce una fecha real en formato YYYY-MM-DD.",
    ],
    [
      "RS02",
      "fecha",
      exists && ast.fecha >= referenceDate,
      `La fecha no es anterior a ${referenceDate} (America/Lima).`,
      "Elige una fecha igual o posterior a la referencia.",
    ],
    [
      "RS03",
      "noches",
      Number.isSafeInteger(ast.noches) && ast.noches > 0,
      "Las noches son un entero positivo representable sin pérdida.",
      "Introduce un entero entre 1 y 9007199254740991.",
    ],
    [
      "RS04",
      "personas",
      Number.isSafeInteger(ast.personas) && ast.personas > 0,
      "Las personas son un entero positivo representable sin pérdida.",
      "Introduce una cantidad entera positiva.",
    ],
    [
      "RS05",
      "habitacion",
      Object.hasOwn(rooms, ast.habitacion) &&
        ast.personas > 0 &&
        ast.personas <= rooms[ast.habitacion],
      "La habitación existe y admite la ocupación solicitada.",
      "Consulta el catálogo y su capacidad máxima.",
    ],
  ];
  return definitions.map(([code, field, passed, message, suggestion]) => ({
    code,
    field,
    passed,
    message,
    suggestion,
  }));
}
