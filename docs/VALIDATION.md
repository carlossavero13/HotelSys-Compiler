# Etapa 4 — Protocolo de evaluación

## Corpus

Fuente: src/metrics/cases.js. 40 casos: 10 válidos, 10 léxicos, 10 sintácticos y 10 semánticos. Cada caso declara ID, entrada, categoría, validez y tipo esperado antes de ejecutar. Fecha fija 2026-11-05, America/Lima; catálogo predeterminado. El resultado agrega validez/tipo observado, aprobación, consistencia y media temporal.

## Medición

`npm run benchmark`: primero una ejecución de cada caso para calentamiento (40 excluidas). Luego 10 repeticiones por caso (400 medidas). Se usa performance.now dentro del pipeline: incluye reconocimiento, construcción de estructuras, reglas y generación cuando procede. Excluye carga inicial de módulos, calentamiento, DOM y archivos de reporte. Entorno y timestamp se almacenan en docs/evidence/benchmark.json. El navegador implementa el mismo protocolo con su userAgent. No se redondea ni fuerza un mínimo antes de calcular las medias.

- Exactitud: casos cuya validez y tipo coinciden con lo esperado en todas las repeticiones / 40.
- Detección: inválidos rechazados / 30.
- Tiempo: media de las 400 ejecuciones.
- Consistencia: casos con resultado completo idéntico (tokens, errores, AST, árbol, reglas y salidas, excluyendo elapsed) en diez repeticiones / 40.
- Cumplimiento: requisitos verificados / 20 requisitos evaluables del Word. Los parciales cuentan en el denominador pero no en el numerador; cada estado señala evidencia y límites. RNF01 utiliza el máximo de todas las ejecuciones (límite 2000 ms), además de la media. Se conservan las duraciones individuales.

## Referencia comparativa

Se compara ANTLR con los reconocedores manuales originales, aplicando a ambos las mismas reglas semánticas actuales. El original acepta nombres que la especificación nueva rechaza; estas discrepancias se conservan. Ambas implementaciones son automatizadas. El comparador no mide una persona ni el comportamiento completo original v2. Su alcance permite comparar clasificación y tiempo local, no atribuir causalidad general ni declarar una mejora ante un procedimiento humano.

Si se requiere referencia humana: presentar los 40 casos con orden aleatorizado a participantes bajo instrucciones y reglas idénticas; registrar decisión/tipo y tiempo desde presentación hasta entrega, sin mostrar etiquetas esperadas; registrar experiencia, dispositivo y condiciones; obtener consentimiento cuando corresponda y mantener anonimato; comparar contra las etiquetas fijadas. Este protocolo NO se ha ejecutado y no hay datos humanos.

## Evidencias

`npm test`: batería y regresiones. `npm run test:ui`: Selenium headless Chrome, entrada válida, tres tipos de error, bloqueo, SQL, batería, limpieza, navegación móvil y overflow; genera selenium.json y capturas. `npm run test:firefox`: 40 entradas desde la interfaz y batería en Firefox; genera firefox.json. `npm run build`: empaquetado estático. Ver los reportes para resultados reales, no la imagen de referencia.

## Límites

Una exactitud del 100 % en 40 casos no prueba ausencia de errores en todo el lenguaje. Los tiempos dependen del equipo, motor JS y calentamiento. Un build local no verifica Vercel remoto. La accesibilidad tiene comprobaciones básicas de semántica HTML/teclado; no se afirma conformidad WCAG certificada.
