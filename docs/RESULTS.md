# Evidencias locales de la versión

- ANTLR oficial 4.13.2: generación JavaScript ejecutada correctamente.
- Vitest 5.1.0: 64 comprobaciones aprobadas en 4 archivos (incluyen 40 solicitudes).
- Selenium: 13 comprobaciones aprobadas en chrome 156.0.8078.80. Capturas revisadas en escritorio y móvil real de 390 px. Reporte: [selenium.json](evidence/selenium.json).
- Vite: construcción de producción completada con motor ANTLR empaquetado.
- npm audit tras actualizar Vitest: 0 vulnerabilidades reportadas.

## Medición Node

Registro 2026-11-05T19:20:43.358Z; v24.20.0; win32/x64.

| Motor | Exactitud de clasificación | Tiempo medio local |
|---|---:|---:|
| ANTLR | 100% | 0.045838 ms |
| Manual original + semántica actual | 95% | 0.009039 ms |

ANTLR: detección de inválidos 100%; consistencia de clasificación 100%. Una ejecución de calentamiento por caso excluida y diez repeticiones por caso. Datos completos: [benchmark.json](evidence/benchmark.json).

El manual fue más rápido en esta ejecución y clasificó incorrectamente dos casos del lenguaje nuevo. No se afirma mejora de velocidad ni comparación frente a personas.

## Límites de cierre

- Word cotejado: matriz literal de 20 requisitos, AFND n0–n6 y derivaciones documentadas. RNF08 queda parcial; ver WORD_REVIEW.md.
- Despliegue 89ecf31 verificado mediante estado Vercel success y GitHub Actions. Las actualizaciones posteriores deben comprobar su propio despliegue.

## Cotejo y pruebas posteriores al Word

Medición 2026-11-05T19:46:00.770Z: ANTLR media 0.042894 ms; máximo 0.525900 ms en 400 ejecuciones (<2000 ms, RNF01). Consistencia del resultado completo: 100%.

Firefox 159.0.1: 40 entradas verificadas desde la interfaz y batería de métricas aprobada. Evidencia: [firefox.json](evidence/firefox.json). Requisitos verificados: 19/20; RNF08 parcial.
