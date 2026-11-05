# Matriz de trazabilidad cotejada con el Word

Fuente: secciones 1.1 y 1.2 del documento académico recibido el 5 de noviembre de 2026. Los enunciados son literales. Ver WORD_REVIEW.md para alcance y huella de la fuente.

Verificados: 19/20 (95%). Los parciales se incluyen en el denominador y no en el numerador. Los estados se limitan al corpus y a las comprobaciones documentadas; no constituyen garantía universal.

| ID | Enunciado | Módulo | Prueba | Evidencia | Estado |
|---|---|---|---|---|---|
| RF01 | El sistema deberá permitir ingresar solicitudes textuales de reservas hoteleras mediante un editor. | ui/app.js; index.html | Selenium: valid request; clear invalidates stale results | docs/evidence/selenium.json | Verificado en el alcance documentado |
| RF02 | El sistema deberá identificar los tokens y lexemas de las solicitudes mediante un analizador léxico. | compiler/index.js; generated/HotelSysLexer.js | compiler.test.js: 16 tokens, 11 categorías | VALID-01; docs/evidence/benchmark.json | Verificado en el alcance documentado |
| RF03 | El sistema deberá detectar caracteres y patrones que incumplan las reglas léxicas. | compiler/index.js | LEXICAL-01…10; bloqueo de AST/salidas | tests/compiler.test.js; benchmark.json | Verificado en el alcance documentado |
| RF04 | El sistema deberá verificar la estructura de las solicitudes mediante una gramática libre de contexto. | grammar/HotelSys.g4; generated/HotelSysParser.js | SYNTACTIC-01…10 | tests/compiler.test.js; benchmark.json | Verificado en el alcance documentado |
| RF05 | El sistema deberá identificar errores sintácticos e indicar su ubicación en la entrada. | compiler/index.js: Errors | ubicaciones sintácticas y recuperación | tests/word-alignment.test.js | Verificado en el alcance documentado |
| RF06 | El sistema deberá generar un árbol sintáctico y una representación estructurada de las solicitudes válidas. | compiler/ast.js; compiler/index.js; ui/app.js | árbol, AST, tres derivaciones literales | tests/compiler.test.js; word-alignment.test.js | Verificado en el alcance documentado |
| RF07 | El sistema deberá comprobar reglas semánticas relacionadas con fechas, noches, habitaciones y ocupantes. | semantic/rules.js | SEMANTIC-01…10; RS01–RS05 | tests/compiler.test.js; benchmark.json | Verificado en el alcance documentado |
| RF08 | El sistema deberá mostrar mensajes que permitan identificar y corregir errores de validación. | compiler/index.js; ui/app.js | LEX01/SYN01/RS03 y sugerencias | tests/word-alignment.test.js; selenium.json | Verificado en el alcance documentado |
| RF09 | El sistema deberá generar representaciones JSON y SQL parametrizado de las solicitudes válidas. | codegen/generate.js | SQL parametrizado y bloqueo por errores | tests/compiler.test.js; selenium.json | Verificado en el alcance documentado |
| RF10 | El sistema deberá permitir ejecutar casos de prueba con entradas correctas e incorrectas. | metrics/cases.js; metrics/evaluate.js | 40 casos 10/10/10/10 y batería del navegador | tests/metrics.test.js; selenium.json | Verificado en el alcance documentado |
| RF11 | El sistema deberá registrar el resultado de validación y el tiempo de procesamiento de cada solicitud. | compiler/index.js; metrics/evaluate.js | validez, tiempo por ejecución, máximo y media | docs/evidence/benchmark.json | Verificado en el alcance documentado |
| RF12 | El sistema deberá utilizar un lexer y parser generados automáticamente mediante un metacompilador. | generated/; scripts/generate.mjs | generación oficial y diff reproducible en CI | GitHub Actions: generate + git diff | Verificado en el alcance documentado |
| RNF01 | Rendimiento: el sistema deberá procesar solicitudes individuales en un tiempo máximo de dos segundos bajo las condiciones de prueba definidas. | metrics/evaluate.js | máximo de 400 ejecuciones ≤ 2000 ms | docs/evidence/benchmark.json: maxMs/performancePassed | Verificado en el alcance documentado |
| RNF02 | Usabilidad: la interfaz deberá distinguir visualmente las etapas de análisis y presentar mensajes comprensibles para el usuario. | ui/app.js; ui/styles.css | fases diferenciadas, diagnóstico y teclado | Selenium y revisión visual; sin estudio de usuarios | Verificado en el alcance documentado |
| RNF03 | Confiabilidad: el sistema deberá producir resultados equivalentes cuando procese entradas idénticas bajo las mismas condiciones. | metrics/evaluate.js | 10 repeticiones: resultado completo salvo tiempo | tests/word-alignment.test.js; benchmark.json | Verificado en el alcance documentado |
| RNF04 | Mantenibilidad: las reglas gramaticales y semánticas deberán permanecer separadas de los componentes de presentación. | grammar/; semantic/; ui/ | separación de módulos e imports | Inspección de arquitectura y build | Verificado en el alcance documentado |
| RNF05 | Compatibilidad: la aplicación deberá funcionar en versiones modernas de navegadores basados en Chromium y Firefox. | scripts/selenium.mjs | Selenium Chromium y Firefox | docs/evidence/selenium.json; docs/evidence/firefox.json | Verificado en el alcance documentado |
| RNF06 | Seguridad: las entradas deberán validarse antes de generar representaciones SQL y no deberán ejecutarse consultas directamente desde el navegador. | compiler/index.js; codegen/generate.js | errores bloquean salidas; SQL sin ejecución | tests/compiler.test.js; inspección del generador | Verificado en el alcance documentado |
| RNF07 | Portabilidad: la aplicación deberá poder desplegarse en Vercel manteniendo sus funcionalidades principales. | vercel.json; vite.config.js | build + estado Vercel del commit 89ecf31 | Vercel Deployment has completed; GitHub Actions | Verificado en el alcance documentado |
| RNF08 | Escalabilidad funcional: la estructura del código deberá permitir incorporar nuevos tokens, producciones y reglas semánticas sin reescribir toda la interfaz. | compiler/; semantic/; ui/ | arquitectura modular; evaluación de extensión pendiente | La UI mantiene cinco campos/etapas explícitos | Parcial: extensión no ensayada |

## Casos representativos §4.3

| Caso | Condición | Caso de la batería o prueba |
|---|---|---|
| CP01 | Todos los campos correctos | VALID-01 |
| CP02 | Identificador válido | VALID-02 |
| CP03 | Código H203 | VALID-01 |
| CP04 | Carácter @ | LEXICAL-01 |
| CP05 | Carácter # | LEXICAL-05 |
| CP06 | Falta = | SYNTACTIC-03 |
| CP07 | Falta campo obligatorio | SYNTACTIC-07 |
| CP08 | Orden incorrecto | SYNTACTIC-10 |
| CP09 | Fecha inexistente | SEMANTIC-01 |
| CP10 | Fecha anterior | SEMANTIC-04 |
| CP11 | NOCHES=0 | SEMANTIC-05 |
| CP12 | PERSONAS=0 | SEMANTIC-06 |
| CP13 | Habitación inexistente | SEMANTIC-07 |
| CP14 | Exceso de ocupantes | SEMANTIC-08 |
| CP15 | JSON y SQL correctos | VALID-01 + prueba de parámetros |
