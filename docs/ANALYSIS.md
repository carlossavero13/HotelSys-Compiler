# Etapa 1 — Auditoría y matriz de brechas

## Estado encontrado

Interfaz monolítica v2 con lexer y parser manuales, árbol reducido, validaciones básicas, tabla de símbolos, SQL interpolado, JSON, temas y exportación. Se encontraron una gramática y módulos TypeScript desconectados de la interfaz. El AST builder nuevo fallaba por callbacks de listener ausentes. No existían pruebas. El build pasaba sin integrar el motor nuevo. `server.js` CommonJS fallaba bajo package.json ESM.

## Brechas y resolución

| Brecha | Resolución | Comprobación |
|---|---|---|
| TypeScript/ANTLR-ng frente a JavaScript/ANTLR4 del prompt | Generador y runtime oficiales 4.13.2; JS | Cabecera generada y npm run generate |
| Dos motores desconectados | Pipeline ANTLR principal, manual preservado | Pruebas y comparación en UI |
| Clientes con números y guión bajo | IDENT [A-Z]+ | Casos léxicos/sintácticos |
| Reglas incompletas | RS01–RS05 y catálogo explícito | Tests y panel individual |
| Fechas dependientes del reloj | Fecha civil America/Lima y referencia inyectable | Test de zona y batería fija |
| Overflow de enteros | Number.isSafeInteger | Regresiones de 310 dígitos |
| SQL interpolado y CONFIRMADA | SQL parametrizado, parámetros separados, SOLICITUD_VALIDA | Test de salida |
| Error global marcaba fecha válida | Estado por regla/campo | Regresión NOCHES=0 |
| Sin AFND ni simulación | AFND con epsilon, AFD total y tablas | Tests de equivalencia |
| Sin 40 casos/métricas | 10 por categoría y 10 repeticiones | benchmark.json |
| Tailwind por CDN | Tailwind compilado localmente | Build sin CDN |
| Sin configuración de despliegue | vercel.json y GitHub Actions | Build local; remoto pendiente |

## Conservación y decisiones

Se guardó el HTML original en docs/prototype-v2.html y el motor manual en src/reference/legacy.js. La referencia visual enviada posteriormente autoriza reorganizar la presentación hacia un panel azul/violeta; se conservan las funciones de compilación, tokens, árboles, símbolos, copia, temas y exportación. El intento TypeScript se archivó localmente en tools/pre-migration-typescript.zip antes de retirar los módulos obsoletos.

Vite se mantiene para empaquetar el runtime y los módulos. No hay React, Next.js, backend ni base de datos. El generador requiere Java únicamente como herramienta de desarrollo. Vercel consume los analizadores JavaScript versionados.

## Pendientes externos

No se dispone del Word completo para cotejar diagramas, tres solicitudes originales y enunciados RF/RNF. Los tres ejemplos implementados se derivan de la gramática real. No se da por verificado el despliegue remoto sin URL. Los porcentajes de la imagen son una referencia gráfica, no evidencia.
