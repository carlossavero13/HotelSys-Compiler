# Evidencias locales de la versión

- ANTLR oficial 4.13.2: generación JavaScript ejecutada correctamente.
- Vitest 5.1.0: 58 comprobaciones aprobadas en 3 archivos (incluyen 40 solicitudes).
- Selenium: 12 comprobaciones aprobadas en chrome 156.0.8078.80. Capturas revisadas en escritorio y móvil real de 390 px. Reporte: [selenium.json](evidence/selenium.json).
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

- Cotejar Word: RF01–RF12, RNF01–RNF08 y figuras originales.
- Confirmar despliegue remoto de Vercel tras subir a GitHub; build local no equivale a publicación verificada.
