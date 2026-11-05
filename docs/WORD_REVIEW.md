# Cotejo del documento académico y HotelSys Compiler

Fuente: TF - COMPILADORES __ SAVERO (1) (1) (1).docx, recibido el 5 de noviembre de 2026. SHA-256: E29CF2D33A6082C29E20F1552692F549CF6B5568A0E6039CC2934418085F6ED6. Se revisaron el texto OOXML, las tablas y las figuras originales de AFND, AFD y árbol sintáctico. No se modificó ni publicó el Word. No se verificó su maquetación/paginación completa: el renderizador empaquetado carece de LibreOffice en este entorno. Los localizadores siguientes son secciones, no páginas inferidas del índice.

## Correspondencias confirmadas

Las secciones 1.1 y 1.2 contienen los 12 RF y los 8 RNF, ahora transcritos literalmente en src/metrics/word-requirements.json. Las once categorías, los dieciséis tokens por sentencia y las cinco reglas RS01–RS05 coinciden con la especificación implementada. La sección 4.2 exige 40 casos en grupos de 10; se conserva esa distribución. La sección 4.3 contiene 15 condiciones representativas, vinculadas a casos concretos sin aumentar ni reemplazar artificialmente el corpus.

## Diferencias corregidas en el software

1. §1.3.5 y figura 5: se reemplazó el AFND equivalente inicial por los siete estados n0–n6 del Word, con epsilon a las ramas par e impar. Se calculan conjuntos y clausuras reales.
2. §1.3.8: derivaciones CARLOS/H203, ANA/H101 y LUIS/H305. No se declara válida semánticamente H305 por aparecer en una demostración sintáctica.
3. RNF01: se registra tiempo máximo e individual, además del promedio. En esta ejecución el máximo ANTLR fue 0.525900 ms frente al límite de 2000 ms. Esto solo prueba las condiciones del corpus y equipo registrados.
4. RNF03: se compara el resultado completo entre repeticiones, excluyendo el tiempo variable.
5. Se añaden la matriz RF/RNF y la correspondencia CP01–CP15.

## Diferencias de representación documentadas

El símbolo inicial interno reserva equivale a solicitud del Word. Los nombres internos EQ, ROOM_ID, DATE e IDENT se corresponden con las categorías académicas publicadas. EOF es una restricción adicional de consumo total. La figura de proceso empresarial menciona disponibilidad, registro y confirmación como pasos del negocio: no se confunden con el alcance del compilador ni se incorporan operaciones reales.

## Contenido del Word que requiere actualizarse con evidencia

- Resumen: conserva marcadores [cantidad], [porcentaje], [tiempo], [procedimiento] y diseño por definir. El corpus técnico ya tiene 40 casos; los demás campos deben distinguir resultados del software y evaluación de la hipótesis.
- Desarrollo, resultados y tercera conclusión: describen ANTLR como pendiente; ya existe integración efectiva, generación reproducible y pruebas.
- Tablas de resultados: pueden incorporar las mediciones de docs/evidence, especificando versión, fecha, equipo y condiciones.
- Hipótesis: el Word propone comparación con un procedimiento sin análisis formal automatizado. El comparador manual actual también es un programa automatizado y no demuestra esa hipótesis. No hay datos humanos ni evidencia para afirmar una reducción de tiempo frente a personas.
- Introducción: cita González-Rojas y colaboradores (2009), pero el desarrollo y las referencias usan 2011. Debe unificarse tras cotejar la fuente bibliográfica original.
- La sección de referencias aparece duplicada como encabezado en el texto extraído.

## Alcance de la verificación

RF01–RF12 se relacionan con pruebas del motor y la interfaz. RNF02 tiene revisión técnica de etapas y mensajes, no un estudio de usabilidad con usuarios. RNF08 permanece parcial: hay separación modular, pero no se ha ensayado una ampliación real del lenguaje sin cambios amplios en la presentación. RNF05 debe sustentarse con los reportes de Chromium y Firefox, no con suposiciones de compatibilidad.
