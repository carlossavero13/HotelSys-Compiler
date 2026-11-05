# HotelSys Compiler v3.0

Compilador académico de solicitudes hoteleras: ANTLR4 **4.13.2**, JavaScript ES6+, HTML5, Tailwind CSS local y Vite. Control de versiones: **GitHub**. Despliegue estático: **Vercel**.

## Ejecutar

Requiere Node.js 24 y npm. Java no es necesario para ejecutar, probar o desplegar.

```sh
npm ci
npm run dev
npm test
npm run benchmark
npm run build
npm run preview
npm run test:ui
```

`npm run test:ui` inicia una vista previa local en 4175 y usa Chrome headless con Selenium. Requiere Chrome y un controlador compatible (Selenium Manager lo descarga si hay red). Capturas y reporte en `docs/evidence/`. `node server.js` se conserva como acceso al servidor Vite local.

## Regenerar ANTLR

Instalar Java 11+ y configurar JAVA_HOME. Ejecutar:

```sh
npm run generate
```

El script descarga el generador oficial 4.13.2 a `tools/` si falta y ejecuta:

```sh
java -jar tools/antlr-4.13.2-complete.jar -Dlanguage=JavaScript -visitor -o src/generated -Xexact-output-dir grammar/HotelSys.g4
```

El runtime `antlr4` está fijado a **4.13.2**. Versionar `src/generated/`, `grammar/` y `package-lock.json`. No editar a mano los analizadores generados. Java y los binarios locales de `tools/` no se publican. Fuentes oficiales: https://www.antlr.org/download.html y https://github.com/antlr/antlr4/blob/master/doc/javascript-target.md.

## Lenguaje

```text
RESERVA CLIENTE=CARLOS HABITACION=H203 FECHA=2026-12-15 NOCHES=3 PERSONAS=2
```

Cinco campos en orden fijo, 16 tokens significativos, 11 categorías. Cliente `[A-Z]+`; habitación `H[0-9]{3}`; fecha `YYYY-MM-DD`; enteros `[0-9]+`. Las palabras reservadas tienen precedencia y no pueden usarse como nombre de cliente. Espacios, tabulaciones y saltos de línea se permiten entre tokens. EOF impide aceptar contenido sobrante.

`src/compiler/index.js` exporta `compile(input, {referenceDate, rooms})`. Fecha predeterminada: fecha civil de **America/Lima**. La batería fija `2026-11-05`; el editor permite otra fecha. Se rechazan enteros fuera del rango seguro de JavaScript. El catálogo es explícito y configurable; no se infiere la existencia de una habitación a partir de su piso.

RS01: existencia calendario. RS02: fecha igual/posterior a referencia. RS03: noches positivas. RS04: personas positivas. RS05: habitación existente y capacidad suficiente.

Un error léxico o sintáctico bloquea AST, semántica y salidas. Un error semántico bloquea SQL/JSON de negocio. El árbol recuperado por ANTLR puede mostrarse para diagnóstico, nunca constituye aceptación. SQL contiene placeholders y un arreglo separado de parámetros; no se ejecuta. **SOLICITUD VÁLIDA no equivale a RESERVA CONFIRMADA**.

## Organización

- `grammar/`: especificación fuente.
- `src/generated/`: lexer, parser y visitor oficiales en JavaScript.
- `src/compiler/`: orquestación, AST, árboles y autómatas educativos.
- `src/semantic/`: cinco reglas, fecha y catálogo.
- `src/codegen/`: traducción SQL/JSON.
- `src/reference/legacy.js`: lexer/parser manuales originales y funciones originales, preservados como referencia.
- `src/ui/`: panel basado en la referencia visual del usuario, navegación, tablas, exportación, temas.
- `src/metrics/`: 40 casos, evaluación y trazabilidad.
- `tests/`: Vitest. `scripts/selenium.mjs`: navegador escritorio/móvil.
- `docs/`: análisis, diseño, evaluación y evidencia. `prototype-v2.html`: prototipo original completo.

## GitHub → Vercel

1. Revisar cambios en rama, ejecutar `npm test` y `npm run build`.
2. Subir la rama al repositorio GitHub y abrir una revisión de cambios.
3. Importar/conectar el repositorio en Vercel. Framework: Vite; comando: `npm run build`; salida: `dist`; raíz: directorio del proyecto.
4. Verificar la URL de Preview: solicitud válida, los tres tipos de error, pruebas y móvil. Después integrar a la rama de producción configurada en Vercel.

`vercel.json` explicita construcción y salida. No requiere servidor, base de datos ni secretos. La existencia de esta configuración no demuestra que un despliegue remoto haya concluido: esa comprobación requiere una URL de Vercel. GitHub Actions regenera ANTLR, comprueba diferencias, ejecuta Vitest, mide y construye.

## Evidencias y límites

Ver `docs/ANALYSIS.md`, `docs/DESIGN.md`, `docs/VALIDATION.md` y `docs/TRACEABILITY.md`. Las mediciones son locales y no se extrapolan a personas ni a producción. Los enunciados RF01–RF12 y RNF01–RNF08 se cotejaron con el Word aportado el 5 de noviembre de 2026. Ver `docs/WORD_REVIEW.md` y la matriz con evidencias y limitaciones; no se modificó ni publicó el documento original.
