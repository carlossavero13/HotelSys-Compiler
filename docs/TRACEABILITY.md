# Matriz de trazabilidad

| Requisito | Descripción | Módulo | Prueba | Evidencia | Estado |
|---|---|---|---|---|---|
| OE1 | Modelar los cinco campos; AFND y AFD del patrón de habitación | grammar/HotelSys.g4; compiler/automata.js | automata.test.js | Tablas, simulador y equivalencia AFND/AFD | Implementado; cotejo Word pendiente |
| OE2 | Gramática y tres derivaciones | compiler/index.js | compiler.test.js: derivaciones | Derivaciones generadas de árboles ANTLR | Implementado |
| OE3 | Once categorías; errores léxicos y sintácticos | compiler/index.js; generated/ | 40 casos + tokens y recuperación | npm test; tabla de tokens | Verificable con pruebas |
| OE4 | Cinco reglas RS01–RS05 | semantic/rules.js | compiler.test.js: calendario, catálogo, límites | Reglas individuales en interfaz | Verificable con pruebas |
| OE5 | Cuarenta solicitudes y procedimiento de referencia | metrics/evaluate.js | metrics.test.js | Reporte exportable y comparación automatizada | Ejecutar batería para medir |
| PROMPT-SQL | JSON y SQL parametrizado, solo si es válido | codegen/generate.js | compiler.test.js: bloqueo de salida | Plantilla y parámetros separados | Verificable con pruebas |
| PROMPT-UI | Interfaz responsive, accesible y salidas seguras | ui/ | scripts/selenium.mjs | Selenium escritorio/móvil; revisión visual | Requiere verificación de interfaz |
| PROMPT-VERCEL | Despliegue compatible con Vercel | vercel.json; vite.config.js | npm run build | dist; falta URL desplegada verificada | Despliegue remoto pendiente |

## Identificadores del Word

Los enunciados literales no se proporcionaron. No se asignan descripciones supuestas.

| ID | Enunciado | Módulo / prueba / evidencia | Estado |
|---|---|---|---|
| RF01 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RF02 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RF03 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RF04 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RF05 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RF06 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RF07 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RF08 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RF09 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RF10 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RF11 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RF12 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RNF01 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RNF02 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RNF03 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RNF04 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RNF05 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RNF06 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RNF07 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
| RNF08 | Pendiente de cotejo | Pendiente de vinculación tras cotejo | No verificado |
