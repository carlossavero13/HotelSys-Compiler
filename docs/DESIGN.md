# Etapa 2 — Especificación y diseño

## Pipeline

Input → lexer ANTLR → CommonTokenStream → parser ANTLR → parse tree → Visitor → AST → RS01–RS05 → validación → SQL y JSON.

El lexer registra errores con línea/columna antes de invocar el parser. No se permite que el descarte de caracteres inválidos genere aceptación. El parser puede recuperar para diagnóstico, pero cualquier error bloquea el AST y las salidas. Línea y columna se muestran desde 1; posición absoluta desde 0.

AST: `{cliente: string, habitacion: string, fecha: string, noches: number, personas: number}`. Enteros fuera de rango seguro no generan código. Parse tree: nodos serializables `{name, children?}`, incluyendo terminales y EOF. Derivaciones: expansión de no terminales por la izquierda sobre el árbol real. Gramática fuente: grammar/HotelSys.g4.

## Correspondencia léxica

| Interno | Académico |
|---|---|
| RESERVA | TOKEN_RESERVA |
| CLIENTE | TOKEN_CLIENTE |
| HABITACION | TOKEN_HABITACION |
| FECHA | TOKEN_FECHA |
| NOCHES | TOKEN_NOCHES |
| PERSONAS | TOKEN_PERSONAS |
| EQ | TOKEN_IGUAL |
| IDENT | TOKEN_IDENTIFICADOR |
| ROOM_ID | TOKEN_COD_HABITACION |
| DATE | TOKEN_FECHA_VALOR |
| INT | TOKEN_ENTERO |

WS se omite; EOF no cuenta entre los 16 tokens. Palabras reservadas tienen prioridad sobre IDENT; fecha tiene prioridad sobre INT. El lenguaje es sensible a mayúsculas.

## Modelos del patrón H[0-9]{3}

AFD: Q={q0,q1,q2,q3,q4,qr}; inicial q0; F={q4}. q0 --H→ q1; q1 --d→ q2; q2 --d→ q3; q3 --d→ q4, d∈0…9. Toda otra transición va a qr; qr es absorbente. Un símbolo adicional tras q4 rechaza.

AFND: Q={s,q0,q1,q2,q3,q4}; inicial s; F={q4}. s --ε→ q0, luego la misma cadena de transiciones. Las no definidas producen ∅. La clausura epsilon inicial {s,q0} corresponde al estado inicial determinista; los demás conjuntos alcanzables son unitarios y ∅ corresponde a qr. Este AFND es una representación equivalente válida, no una afirmación de identidad con una figura de Word no entregada.

## Semántica y catálogo

Referencia configurable como fecha civil ISO, zona America/Lima. El calendario se comprueba mediante componentes UTC sin depender de la zona del host. Habitaciones predeterminadas: H101/H102/H203/H204 (2), H301/H302/H401/H402 (4), H503/H504 (6). La existencia es membresía propia del catálogo; no hay disponibilidad dinámica.

Las cinco reglas se evalúan individualmente después de la sintaxis. Fechas inexistentes incumplen RS01 y no pueden cumplir RS02. Cada error semántico apunta al token del campo. Los errores de configuración se distinguen de los de la solicitud.

## Interfaz y seguridad

Panel responsive según referencia del usuario. Temas localStorage; resultados invalidados al editar. Toda interpolación de entradas en HTML pasa por escape; otras salidas usan textContent. SQL y parámetros separados. Auditorías mediante Blob descargable. Sin ejecución SQL ni envío de solicitudes a servicios externos.
