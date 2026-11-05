export function generate(ast) {
  const parameters = [
    ast.cliente,
    ast.habitacion,
    ast.fecha,
    ast.noches,
    ast.personas,
    "SOLICITUD_VALIDA",
  ];
  return {
    sql: "INSERT INTO reservas (cliente_nombre, habitacion_codigo, fecha_llegada, total_noches, total_personas, estado_solicitud) VALUES ($1, $2, $3, $4, $5, $6);",
    parameters,
    json: JSON.stringify(
      { type: "SolicitudReserva", status: "SOLICITUD_VALIDA", ...ast },
      null,
      2,
    ),
  };
}
