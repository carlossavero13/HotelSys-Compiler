# HotelSys Compiler • Compilador Profesional de Reservas Hoteleras

Sistema integral de compilación y traducción de lenguaje formal en un solo archivo (**HTML5 + Tailwind CSS + JavaScript puro**), implementado bajo las directrices de diseño **Apple Human Interface (iOS 18)** con soporte para **Modo Claro / Modo Oscuro (OLED Black)**.

---

## 🌐 Enlaces del Proyecto

* 💻 **Repositorio en GitHub**: [https://github.com/carlossavero13/HotelSys-Compiler](https://github.com/carlossavero13/HotelSys-Compiler)
* 🚀 **Servidor Local Activo**: [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Las 5 Fases del Ciclo de Compilación

A diferencia de un simple validador sintáctico, este proyecto implementa el **pipeline completo de un compilador formal**:

```
[ Sentencia Fuente ] 
         │
         ▼
[ Fase 1: Entrada y Normalización ]
         │
         ▼
[ Fase 2: Análisis Léxico (Scanner / Tokenizer) ] ──▶ (11 Tokens & Posiciones)
         │
         ▼
[ Fase 3: Análisis Sintáctico (Parser GLC) ] ──────▶ (Árbol Gráfico AST & ASCII)
         │
         ▼
[ Fase 4: Análisis Semántico & Tabla de Símbolos ] ─▶ (Offset de Memoria & Reglas)
         │
         ▼
[ Fase 5: Generación de Código Destino ] ──────────▶ (SQL DML & Payload REST JSON)
```

---

### 1. Fase 1: Entrada y Carga de la Sentencia
* Editor monospace tipo *macOS/Xcode* con conteo de caracteres.
* Casos de prueba en 1 clic para sustentación inmediata (`Correcto 1`, `Correcto 2`, `Err. Semántico 30 Feb`, `Err. Semántico 0 Noches`, `Err. Habitación`, `Err. Léxico`).

### 2. Fase 2: Análisis Léxico (Scanner)
* Expresiones regulares que identifican palabras clave, identificadores, códigos de habitación, fechas y enteros.
* Tabla estilizada con índices y posiciones del texto.

### 3. Fase 3: Análisis Sintáctico (Parser)
* Conmutador con pestañas:
  * **🌳 Árbol Gráfico**: Diagrama de nodos interactivo con niveles jerárquicos (Raíz, No-Terminales, Hojas).
  * **📜 Vista Monospace**: Estructura en texto ASCII con botón para copiar al portapapeles.

### 4. Fase 4: Análisis Semántico & Tabla de Símbolos
* **Diferenciación Teórica Clave**:
  * Un analizador sintáctico aprueba `FECHA=2026-02-30` o `NOCHES=0` porque cumplen la forma `YYYY-MM-DD` y `ENTERO`.
  * El **Analizador Semántico** detecta que el 30 de febrero no existe en el calendario y que una estancia hotelera no puede tener 0 noches.
* **Tabla de Símbolos**: Registra cada lexema con su tipo de dato (`VARCHAR`, `ROOM_ID`, `DATE_ISO8601`, `INT_POSITIVE`), dirección simulada en memoria (`0x0040`, `0x0048`, `0x0050`...), ámbito (*scope*) y valor semántico.

### 5. Fase 5: Generación de Código Destino (Code Generation)
* Traduce la reserva a:
  * **SQL DML**: Sentencia `INSERT INTO reservas (...) VALUES (...)` lista para la base de datos relacional del hotel.
  * **Payload JSON**: Objeto estructurado para consumo inmediato en APIs REST / Microservicios.

---

## 📐 Fundamentación Formal de Autómatas

El proyecto implementa explícitamente la **Jerarquía de Chomsky**:

### 1. Autómata Finito Determinista (AFD) — Nivel 3 (Fase Léxica)
* **Definición Formal**: $M = (Q, \Sigma, \delta, q_0, F)$
* **Función de Transición ($\delta$)**: Reconoce cada token caracter por caracter.
  * Reconocedor de Habitación: `(q0) --'H'--> (q1) --dígito--> (q2) --dígito--> (q3) --dígito--> ((q4: TOKEN_HAB_ID))`
  * Reconocedor de Operador: `(q0) --'='--> ((q_op: TOKEN_IGUAL))`
  * Manejo de Errores: Cualquier símbolo no perteneciente al alfabeto cae en un estado sumidero / trampa emitiendo `TOKEN_ERROR`.

### 2. Autómata de Pila (AP) — Nivel 2 (Fase Sintáctica)
* **Definición Formal**: $M = (Q, \Sigma, \Gamma, \delta, q_0, Z_0, F)$
* **Alfabeto de Pila ($\Gamma$)**: Contiene los no-terminales de la Gramática Libre de Contexto (GLC).
* **Mecanismo Push / Pop**:
  1. Apila la regla de producción `<Reserva>`.
  2. A medida que el lexer entrega cada token (`RESERVA`, `CLIENTE`, `HABITACION`...), el parser realiza `match()` desapilando los elementos de la memoria auxiliar (la pila de llamadas del sistema).
  3. Si la pila queda reducida al símbolo base $Z_0$ y se alcanza el token `EOF`, la cadena es **Aceptada Formalmente**.
  * **Payload JSON**: Objeto estructurado para consumo inmediato en APIs REST / Microservicios.

---

## 🎨 Características UI / UX Apple

* **Conmutador de Tema (Modo Claro / Modo Oscuro)**: Persistencia en `localStorage` con acabado titanio y negro profundo.
* **Descarga de Auditoría (.json)**: Genera y descarga el informe técnico completo de la compilación en un archivo JSON.
* **Notificaciones Toast estilo Dynamic Island**.
