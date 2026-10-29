# Automatización del Análisis Léxico y Sintáctico de Reservas Hoteleras

Sistema interactivo web en un solo archivo (**HTML5 + Tailwind CSS + JavaScript puro**) estructurado como un pipeline de compilación formal con diseño de alta fidelidad **Apple Human Interface Guidelines (iOS 18)**.

---

## 🌐 Acceso al Proyecto en Ejecución

El servidor local se encuentra activo en segundo plano:
* 👉 **URL Local**: [http://localhost:3000](http://localhost:3000)
* 👉 **Archivo Fuente**: [`index.html`](file:///c:/Users/carlo/Desktop/Compiladores%20web/index.html)
* 👉 **Script del Servidor**: [`server.js`](file:///c:/Users/carlo/Desktop/Compiladores%20web/server.js) (Node.js sin dependencias externas)

---

## 🧭 Estructura y Comentarios Didácticos por Sección

El sistema está dividido en **4 fases pedagógicas** con explicaciones directas para facilitar la exposición ante el evaluador o docente:

### 1. Barra de Pipeline de Compilación (Stepper UX)
* **Propósito**: Muestra visualmente las 3 fases del proceso en tiempo real:
  1. *Entrada de Código*
  2. *Análisis Léxico (Scanner)*
  3. *Análisis Sintáctico (Parser)*
* **Comentario didáctico**: Si se introduce un error en cualquier fase, el indicador cambia dinámicamente de un check verde (`✓`) a una cruz roja (`✕`), indicando en qué etapa exacta falló la compilación.

---

### 2. Fase 1: Entrada y Carga de la Sentencia
* **Propósito**: Es el punto de partida del compilador donde se suministra el código fuente.
* **Comentario didáctico**: La sentencia debe iniciar con la palabra reservada `RESERVA` y contener los 5 atributos obligatorios en el orden exacto:
  ```text
  RESERVA CLIENTE=<ID> HABITACION=H<3D> FECHA=<YYYY-MM-DD> NOCHES=<NUM> PERSONAS=<NUM>
  ```
* **Elementos interactivos**:
  * Píldoras de prueba con 1 solo clic (`Correcto 1`, `Correcto 2`, `Err. Habitación`, `Err. Fecha`, `Err. Léxico`, `Falta Campo`).
  * Consola editora tipo terminal Xcode con conteo de caracteres.
  * Botón prominente de ejecución.

---

### 3. Fase 2: Análisis Léxico (Scanner / Tokenizer)
* **Propósito**: Agrupar el flujo continuo de caracteres en unidades lógicas con significado llamadas **Tokens**.
* **Comentario didáctico**:
  * Descarta los espacios en blanco y tabulaciones.
  * Clasifica cada lexema según expresiones regulares (`TOKEN_RESERVA`, `TOKEN_CLIENTE`, `TOKEN_HABITACION`, `TOKEN_FECHA`, `TOKEN_NOCHES`, `TOKEN_PERSONAS`, `TOKEN_IGUAL`, `TOKEN_IDENTIFICADOR`, `TOKEN_HAB_ID`, `TOKEN_FECHA_VAL`, `TOKEN_ENTERO`).
  * Si un carácter no pertenece al alfabeto permitido (por ejemplo `@`, `#`, `$`), genera de inmediato un `TOKEN_ERROR` sin detener el scanner, señalando la posición exacta del fallo.

---

### 4. Fase 3: Análisis Sintáctico (Parser & AST)
* **Propósito**: Verificar que la secuencia de tokens cumpla la **Gramática Libre de Contexto (GLC)** mediante un Analizador Descendente Recursivo.
* **Comentario didáctico**:
  * Si la estructura es correcta, construye el **Árbol de Sintaxis Abstracta (AST)** jerárquico.
  * Habilita simultáneamente la **Ficha Semántica** (*Apple Hotel Pass*) con los datos limpios de la reserva.
  * Si hay una discrepancia sintáctica (falta de un campo o formato incorrecto), despliega una alerta con el diagnóstico exacto: qué token se esperaba, cuál se recibió y en qué posición del texto ocurrió el rechazo.
