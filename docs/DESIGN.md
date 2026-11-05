# Etapa 2 — Especificación y diseño

## Pipeline

Input → lexer ANTLR → CommonTokenStream → parser ANTLR → parse tree → Visitor → AST → RS01–RS05 → validación → SQL y JSON.

El lexer registra errores con línea/columna antes de invocar el parser. No se permite que el descarte de caracteres inválidos genere aceptación. El parser puede recuperar para diagnóstico, pero cualquier error bloquea el AST y las salidas. Línea y columna se muestran desde 1; posición absoluta desde 0.

AST: `{cliente: string, habitacion: string, fecha: string, noches: number, personas: number}`. Enteros fuera de rango seguro no generan código. Parse tree: nodos serializables `{name, children?}`, incluyendo terminales y EOF. Derivaciones: expansión de no terminales por la izquierda sobre el árbol real. Gramática fuente: grammar/HotelSys.g4. El nombre interno reserva corresponde al símbolo solicitud del Word; EOF se añade para exigir consumo completo. Las tres derivaciones usan los ejemplos literales CARLOS/H203, ANA/H101 y LUIS/H305. H305 es sintácticamente válido pero su existencia depende del catálogo.

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

AFND del Word (§1.3.5): Q={n0,n1,n2,n3,n4,n5,n6}, inicial n0, F={n6}. n0 --H→ n1; n1 --ε→ {n2,n3}; n2 reconoce primer dígito par y n3 impar, ambos hacia n4; n4 --dígito→ n5 --dígito→ n6. Transiciones no definidas llevan a ∅. Subconjuntos alcanzables: {n0}, {n1,n2,n3}, {n4}, {n5}, {n6}, ∅, correspondientes a q0,q1,q2,q3,q4,qr. El simulador calcula conjuntos de estados y clausura epsilon.

## Semántica y catálogo

Referencia configurable como fecha civil ISO, zona America/Lima. El calendario se comprueba mediante componentes UTC sin depender de la zona del host. Habitaciones predeterminadas: H101/H102/H203/H204 (2), H301/H302/H401/H402 (4), H503/H504 (6). La existencia es membresía propia del catálogo; no hay disponibilidad dinámica.

Las cinco reglas se evalúan individualmente después de la sintaxis. Fechas inexistentes incumplen RS01 y no pueden cumplir RS02. Cada error semántico apunta al token del campo. Los errores de configuración se distinguen de los de la solicitud.

## Interfaz y seguridad

Panel responsive según referencia del usuario. Temas localStorage; resultados invalidados al editar. Toda interpolación de entradas en HTML pasa por escape; otras salidas usan textContent. SQL y parámetros separados. Auditorías mediante Blob descargable. Sin ejecución SQL ni envío de solicitudes a servicios externos.
