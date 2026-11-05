import { WORD_DERIVATIONS } from "../metrics/word-examples.js";
import "./styles.css";
import { compile } from "../compiler/index.js";
import { DEFAULT_ROOMS, limaDate } from "../semantic/rules.js";
import { CASES, BASE, REFERENCE_DATE } from "../metrics/cases.js";
import { evaluate, manualCompile } from "../metrics/evaluate.js";
import {
  TRACEABILITY,
  requirementSummary,
  WORD_CASE_MAPPING,
} from "../metrics/requirements.js";
import {
  DFA_STATES,
  transition,
  simulate,
  simulateNFA,
} from "../compiler/automata.js";
import grammar from "../../grammar/HotelSys.g4?raw";

const $ = (id) => document.getElementById(id);
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const labels = {
  valid: "Válida",
  lexical: "Léxico",
  syntactic: "Sintáctico",
  semantic: "Semántico",
};
let current = null,
  activeTab = "lexical",
  codeTab = "json",
  rooms = { ...DEFAULT_ROOMS },
  report = null;
let toastTimer;
function toast(message) {
  $("toast").textContent = message;
  $("toast").classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.add("hidden"), 3500);
}
function table(headers, rows) {
  return `<div class="table-scroll"><table><thead><tr>${headers.map((h) => `<th>${escape(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((c) => `<td>${escape(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function treeText(tree, prefix = "") {
  return tree
    ? prefix +
        tree.name +
        "\n" +
        (tree.children ?? [])
          .map((child) => treeText(child, prefix + "  "))
          .join("")
    : "No disponible: compila una solicitud.";
}
function treeGraph(tree) {
  return tree
    ? `<li><span class="${tree.children ? "nonterminal" : "terminal"}">${escape(tree.name)}</span>${tree.children ? `<ul>${tree.children.map(treeGraph).join("")}</ul>` : ""}</li>`
    : "";
}
function download(name, data) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function updateEditor() {
  const text = $("source").value;
  $("lineNumbers").textContent = Array.from(
    { length: text.split("\n").length },
    (_, i) => i + 1,
  ).join("\n");
  $("charCount").textContent =
    `${text.length} caracteres · JavaScript / ANTLR4`;
}
function invalidate() {
  current = null;
  render();
  updateEditor();
}
function run() {
  try {
    current = compile($("source").value, {
      referenceDate: $("referenceDate").value,
      rooms,
    });
    render();
  } catch (error) {
    current = null;
    render();
    toast(error.message);
  }
}
function render() {
  const r = current;
  const stages = [
    ["▧", "Léxico", "tokens", r && !r.errors.some((e) => e.type === "lexical")],
    ["〈/〉", "Sintáctico", "parser", r && !!r.ast],
    ["⬡", "AST", "estructura", r && !!r.ast],
    ["♢", "Semántico", "reglas", r && r.valid],
    ["▤", "Código", "JSON / SQL", r && !!r.codeGen],
  ];
  let blocked = false;
  $("pipeline").innerHTML = stages
    .map(([icon, title, sub, ok], i) => {
      const fail = r && !ok && !blocked;
      if (fail) blocked = true;
      return `${i ? '<span class="arrow">→</span>' : ""}<div class="stage ${ok ? "pass" : fail ? "fail" : ""}"><span class="check">${ok ? "✓" : fail ? "×" : "·"}</span><em>${icon}</em><b>${title}</b><small>(${sub})</small></div>`;
    })
    .join("");
  $("status").className = `status ${r ? (r.valid ? "valid" : "invalid") : ""}`;
  $("status").innerHTML =
    `<span class="status-icon">${r ? (r.valid ? "✓" : "×") : "○"}</span><div><strong>${r ? (r.valid ? "SOLICITUD VÁLIDA" : "SOLICITUD INVÁLIDA") : "PENDIENTE DE ANÁLISIS"}</strong><small>${r ? (r.valid ? "La entrada superó el análisis léxico, sintáctico y semántico." : `${r.errors.length} error(es) · ${labels[r.type]}`) : "Compila la entrada para actualizar los resultados."}</small></div><div class="time"><small>Tiempo de procesamiento</small><b id="elapsed">${r && $("measure").checked ? r.elapsed.toFixed(2) + " ms" : "—"}</b></div>`;
  $("source").setAttribute("aria-invalid", String(!!r && !r.valid));
  $("astGraph").innerHTML = r?.ast
    ? `<div class="ast-root"><b>Reserva</b></div><div class="ast-fields">${Object.entries(
        r.ast,
      )
        .map(
          ([k, v]) =>
            `<div class="ast-field"><b>${escape(k)}</b><code>${escape(typeof v === "string" ? JSON.stringify(v) : v)}</code></div>`,
        )
        .join("")}</div>`
    : '<p class="muted">El AST estará disponible cuando la sintaxis sea válida.</p>';
  const descriptions = [
    "La fecha existe en el calendario.",
    "La fecha no es anterior a la referencia.",
    "La cantidad de noches es mayor que cero.",
    "La cantidad de personas es mayor que cero.",
    "La habitación existe y admite los huéspedes.",
  ];
  $("ruleList").innerHTML = descriptions
    .map((text, i) => {
      const rule = r?.rules[i];
      return `<div class="rule"><span>${rule ? (rule.passed ? "🟢" : "🔴") : "○"}</span><span><b>RS0${i + 1}:</b> ${escape(text)}</span><span class="rule-state ${rule ? (rule.passed ? "good" : "bad") : "neutral"}">${rule ? (rule.passed ? "OK" : "ERROR") : "—"}</span></div>`;
    })
    .join("");
  $("fullTree").textContent = treeText(r?.tree);
  $("fullAST").textContent = r?.ast
    ? JSON.stringify(
        r.ast,
        (_, v) =>
          typeof v === "number" && !Number.isFinite(v) ? String(v) : v,
        2,
      )
    : "AST no construido.";
  $("symbols").innerHTML = r?.ast
    ? table(
        ["Símbolo", "Tipo", "Valor", "Estado"],
        Object.entries(r.ast).map(([k, v]) => [
          k,
          typeof v === "number"
            ? "INT_POSITIVE"
            : k === "fecha"
              ? "DATE"
              : k === "habitacion"
                ? "ROOM_ID"
                : "IDENT",
          v,
          r.rules.some((rule) => rule.field === k && !rule.passed)
            ? "Inválido"
            : "Válido",
        ]),
      )
    : "<p>Sin símbolos.</p>";
  $("errors").classList.toggle("hidden", !r?.errors.length);
  $("errors").innerHTML = r?.errors.length
    ? "<h2>Diagnóstico de la solicitud</h2>" +
      r.errors
        .map(
          (e) =>
            `<div class="error-item"><b>${escape(e.code)} · ${escape(labels[e.type])} · Línea ${e.line}, columna ${e.column}</b><p>${escape(e.type === "semantic" ? "Condición incumplida: " : "")}${escape(e.message)}</p><code>${escape(e.fragment)}</code><p>${escape(e.suggestion)}</p></div>`,
        )
        .join("")
    : "";
  $("audit").disabled = !r;
  document
    .querySelectorAll("[data-code]")
    .forEach((b) => (b.disabled = !r?.codeGen));
  renderTab();
}
function renderTab() {
  const r = current,
    panel = $("resultPanel");
  document.querySelectorAll("[data-tab]").forEach((b) => {
    b.setAttribute("aria-selected", String(b.dataset.tab === activeTab));
    b.tabIndex = b.dataset.tab === activeTab ? 0 : -1;
  });
  if (activeTab === "lexical") {
    panel.innerHTML =
      "<h2><i>▱</i> Análisis Léxico</h2><p>Tokens y lexemas reconocidos por el lexer generado con ANTLR4.</p>" +
      (r
        ? `<div class="table-scroll"><table><thead><tr><th>#</th><th>Token</th><th>Lexema</th><th>Línea</th><th>Columna</th></tr></thead><tbody>${r.tokens.map((t, i) => `<tr><td>${i + 1}</td><td><span class="token ${t.type.includes("COD_HABITACION") ? "room" : /IDENTIFICADOR|FECHA_VALOR|ENTERO/.test(t.type) ? "literal" : ""}">${escape(t.type)}</span></td><td><code>${escape(t.value)}</code></td><td>${t.line}</td><td>${t.column}</td></tr>`).join("")}</tbody></table></div><div class="table-footer"><span>▱ Total de tokens: ${r.tokens.length}</span><span>Categorías reconocidas: ${new Set(r.tokens.map((t) => t.type)).size}</span></div>`
        : "<p>Esperando compilación.</p>");
  } else if (activeTab === "syntax") {
    panel.innerHTML =
      "<h2><i>〈〉</i> Análisis Sintáctico</h2><p>La recuperación del parser nunca autoriza la generación de código.</p><pre></pre>";
    panel.querySelector("pre").textContent = r
      ? (r.ast ? "Sintaxis válida.\n\n" : "Sintaxis no aprobada.\n\n") +
        r.derivations.join("\n⇒ ")
      : "Sin análisis.";
  } else if (activeTab === "tree" || activeTab === "ast") {
    panel.innerHTML = `<h2>${activeTab === "tree" ? "Árbol sintáctico (ST)" : "AST · cinco atributos"}</h2><button id="copyTree" class="small subtle">Copiar</button>${activeTab === "tree" && r?.tree ? `<div class="st-diagram" aria-label="Árbol de análisis generado por ANTLR"><ul>${treeGraph(r.tree)}</ul></div>` : ""}<pre></pre>`;
    panel.querySelector("pre").textContent =
      activeTab === "tree" ? treeText(r?.tree) : $("fullAST").textContent;
    $("copyTree").onclick = () => copy(panel.querySelector("pre").textContent);
  } else if (activeTab === "rules") {
    panel.innerHTML =
      "<h2>Reglas Semánticas</h2>" +
      (r?.rules.length
        ? r.rules
            .map(
              (rule) =>
                `<div class="error-item"><b class="tag ${rule.passed ? "good" : "bad"}">${rule.code} · ${rule.passed ? "CUMPLE" : "NO CUMPLE"}</b><p>${escape(rule.message)}</p>${rule.passed ? "" : `<small>${escape(rule.suggestion)}</small>`}</div>`,
            )
            .join("")
        : "<p>No evaluadas: se requiere léxico y sintaxis válidos.</p>");
  } else {
    panel.innerHTML =
      '<h2><i>▤</i> Código Generado</h2><div class="actions"><button id="showJSON">JSON</button><button id="showSQL">SQL parametrizado</button><button id="copyCode">Copiar</button></div><pre id="codeOutput"></pre>';
    $("codeOutput").textContent = !r?.codeGen
      ? "Generación bloqueada hasta obtener una solicitud válida."
      : codeTab === "json"
        ? r.codeGen.json
        : r.codeGen.sql +
          "\n\n-- Parámetros separados (JSON):\n" +
          JSON.stringify(r.codeGen.parameters, null, 2);
    $("showJSON").onclick = () => {
      codeTab = "json";
      renderTab();
    };
    $("showSQL").onclick = () => {
      codeTab = "sql";
      renderTab();
    };
    $("copyCode").disabled = !r?.codeGen;
    $("copyCode").onclick = () => copy($("codeOutput").textContent);
  }
}
async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast("Contenido copiado.");
  } catch {
    toast(
      "No se pudo acceder al portapapeles; selecciona el texto para copiarlo.",
    );
  }
}
function metrics() {
  const values = [
    [
      "Exactitud de clasificación",
      report
        ? `${(report.classificationAccuracy * 100).toFixed(1)} %`
        : "Sin ejecutar",
    ],
    [
      "Detección de errores",
      report ? `${(report.invalidDetection * 100).toFixed(1)} %` : "—",
    ],
    ["Tiempo promedio", report ? `${report.meanMs.toFixed(3)} ms` : "—"],
    [
      "Consistencia (10 ejecuciones)",
      report ? `${(report.consistency * 100).toFixed(1)} %` : "—",
    ],
  ];
  values.push([
    "Máximo observado (RNF01)",
    report ? `${report.maxMs.toFixed(3)} ms / 2000 ms` : "Sin ejecutar",
  ]);
  $("metricSummary").innerHTML = values
    .map(([k, v]) => `<div><dt>${k}</dt><dd><b>${v}</b></dd></div>`)
    .join("");
  $("caseTable").innerHTML = table(
    [
      "ID",
      "Categoría",
      "Entrada completa",
      "Esperado",
      "Obtenido",
      "Error esperado / obtenido",
      "Prueba",
    ],
    (report?.rows ?? CASES).map((c) => [
      c.id,
      labels[c.category],
      c.input,
      c.expectedValid ? "Válida" : "Inválida",
      c.obtainedValid === undefined
        ? "Pendiente"
        : c.obtainedValid
          ? "Válida"
          : "Inválida",
      `${labels[c.expectedType]} / ${c.obtainedType ? labels[c.obtainedType] : "—"}`,
      c.passed === undefined
        ? "Sin ejecutar"
        : c.passed
          ? "APROBADA"
          : "FALLIDA",
    ]),
  );
  if (report) {
    const pass = report.rows.filter((r) => r.passed).length;
    $("progressValue").textContent = `${pass}/40`;
    $("progressRing").style.background =
      `conic-gradient(#2aca7a ${(pass / 40) * 360}deg,#37415e 0deg)`;
    $("testProgress").textContent =
      `${pass === 40 ? "✓" : "!"} ${pass}/40 casos`;
    $("environment").textContent =
      `${report.environment} · ${report.samples} mediciones · referencia ${report.referenceDate} · America/Lima · ${report.timestamp}`;
    $("exportMetrics").disabled = false;
  }
}
async function runTests() {
  for (const id of ["runTests", "runTestsDetail"]) $(id).disabled = true;
  toast("Ejecutando 40 casos × 10 repeticiones…");
  await new Promise((resolve) => setTimeout(resolve, 30));
  try {
    report = evaluate();
    metrics();
    toast(`${report.rows.filter((r) => r.passed).length}/40 casos aprobados.`);
  } catch (e) {
    toast(e.message);
  } finally {
    for (const id of ["runTests", "runTestsDetail"]) $(id).disabled = false;
  }
}
function formal() {
  $("grammarText").textContent = grammar;
  $("dfaTable").innerHTML = table(
    ["Estado", "H", "0–9", "Otro", "Acepta"],
    DFA_STATES.map((s) => [
      s,
      transition(s, "H"),
      transition(s, "2"),
      transition(s, "X"),
      s === "q4" ? "Sí" : "No",
    ]),
  );
  $("nfaTable").innerHTML = table(
    ["Estado", "Entrada", "Destino"],
    [
      ["n0", "H", "{n1}"],
      ["n1", "ε", "{n2, n3}"],
      ["n2", "0,2,4,6,8", "{n4}"],
      ["n3", "1,3,5,7,9", "{n4}"],
      ["n4", "0–9", "{n5}"],
      ["n5", "0–9", "{n6}"],
      ["n6", "Cualquiera", "∅"],
    ],
  );
  $("derivationExamples").innerHTML = WORD_DERIVATIONS.map((input) => ({
    input,
  }))
    .map((c, i) => {
      const result = compile(c.input, { referenceDate: REFERENCE_DATE });
      return `<details ${i === 0 ? "open" : ""}><summary>Derivación ${i + 1} · ${escape(c.input)}</summary><pre>${escape(result.derivations.join("\n⇒ "))}</pre></details>`;
    })
    .join("");
  $("traceability").innerHTML = table(
    [
      "Requisito",
      "Descripción",
      "Módulo",
      "Caso de prueba",
      "Evidencia",
      "Estado",
    ],
    TRACEABILITY.map((r) => [
      r.id,
      r.requirement,
      r.module,
      r.test,
      r.evidence,
      r.status,
    ]),
  );
  const summary = requirementSummary();
  $("pendingRequirements").innerHTML = TRACEABILITY.map(
    (r) =>
      `<span class="${r.verified ? "good" : "neutral"}">${r.id} · ${r.verified ? "verificado" : "parcial"}</span>`,
  ).join("");
  $("requirementSummary").textContent =
    `${summary.verified}/${summary.total} requisitos verificados (${summary.percentage.toFixed(0)} %), en el alcance de las evidencias registradas.`;
  $("wordCases").innerHTML = table(
    ["Caso Word", "Condición", "Prueba vinculada"],
    WORD_CASE_MAPPING,
  );
  simulateInput();
}
function simulateInput() {
  const input = $("automataInput").value,
    d = simulate(input),
    n = simulateNFA(input);
  $("automataResult").textContent =
    `AFD: ${d.path.join(" → ")} · ${d.accepted ? "ACEPTADA" : "RECHAZADA"} | AFND: ${n.path.join(" → ")} · ${n.accepted ? "ACEPTADA" : "RECHAZADA"}`;
}

$("source").value = BASE.replace(" FECHA", "\nFECHA");
$("referenceDate").value = limaDate();
$("rooms").value = JSON.stringify(rooms, null, 2);
CASES.forEach((c) => {
  const option = document.createElement("option");
  option.value = c.id;
  option.textContent = `${c.id} · ${labels[c.category]}`;
  $("examples").append(option);
});
$("examples").onchange = (event) => {
  const c = CASES.find((c) => c.id === event.target.value);
  if (c) {
    $("source").value = c.input;
    updateEditor();
    run();
  }
};
$("source").oninput = invalidate;
$("source").onscroll = () =>
  ($("lineNumbers").scrollTop = $("source").scrollTop);
$("source").onkeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    run();
  }
};
$("referenceDate").onchange = invalidate;
$("measure").onchange = render;
$("compile").onclick = run;
$("clear").onclick = () => {
  $("source").value = "";
  $("manualResult").textContent = "";
  invalidate();
  $("source").focus();
};
$("manual").onclick = () => {
  try {
    const result = manualCompile($("source").value, {
      referenceDate: $("referenceDate").value,
      rooms,
    });
    $("manualResult").textContent =
      `Referencia manual original: ${labels[result.type]} · ${result.elapsed.toFixed(3)} ms. Puede aceptar un lenguaje diferente; no sustituye el resultado ANTLR4.`;
  } catch (e) {
    toast(e.message);
  }
};
$("applyRooms").onclick = () => {
  try {
    const candidate = JSON.parse($("rooms").value);
    compile(BASE, {
      referenceDate: $("referenceDate").value,
      rooms: candidate,
    });
    rooms = candidate;
    $("catalogMessage").textContent =
      "Catálogo aplicado a la sesión del editor.";
    run();
  } catch (e) {
    $("catalogMessage").textContent = e.message;
  }
};
document.querySelectorAll("[data-tab]").forEach((button, index, buttons) => {
  button.id = `tab-${button.dataset.tab}`;
  button.setAttribute("aria-controls", "resultPanel");
  button.onclick = () => {
    activeTab = button.dataset.tab;
    $("resultPanel").setAttribute("aria-labelledby", button.id);
    renderTab();
  };
  button.onkeydown = (e) => {
    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const target =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? buttons.length - 1
            : (index + (e.key === "ArrowRight" ? 1 : -1) + buttons.length) %
              buttons.length;
      buttons[target].click();
      buttons[target].focus();
    }
  };
});
document.querySelectorAll("[data-code]").forEach(
  (b) =>
    (b.onclick = () => {
      codeTab = b.dataset.code;
      activeTab = "code";
      renderTab();
      $("resultPanel").scrollIntoView({ block: "center", behavior: "smooth" });
    }),
);
$("audit").onclick = () =>
  current &&
  download("hotelsys-auditoria.json", {
    version: "3.0.0",
    engine: "ANTLR 4.13.2 JavaScript",
    ...current,
  });
$("runTests").onclick = runTests;
$("runTestsDetail").onclick = runTests;
$("exportMetrics").onclick = () =>
  report && download("hotelsys-metricas.json", report);
$("compare").onclick = async () => {
  $("compare").disabled = true;
  await new Promise((resolve) => setTimeout(resolve, 30));
  try {
    const generated = evaluate(),
      manual = evaluate({ engine: manualCompile });
    $("comparison").textContent = JSON.stringify(
      {
        reference: "Dos implementaciones automatizadas; semántica compartida.",
        antlr: {
          accuracy: generated.classificationAccuracy,
          meanMs: generated.meanMs,
        },
        manual: {
          accuracy: manual.classificationAccuracy,
          meanMs: manual.meanMs,
        },
        differences: generated.rows
          .filter((row, i) => row.obtainedType !== manual.rows[i].obtainedType)
          .map((row) => ({
            id: row.id,
            input: row.input,
            antlr: row.obtainedType,
            manual: manual.rows.find((m) => m.id === row.id).obtainedType,
          })),
      },
      null,
      2,
    );
  } finally {
    $("compare").disabled = false;
  }
};
$("simulate").onclick = simulateInput;
$("automataInput").onkeydown = (e) => {
  if (e.key === "Enter") simulateInput();
};
try {
  if (localStorage.getItem("hotelsys-theme") === "light")
    document.documentElement.className = "light";
} catch {}
$("theme").onclick = () => {
  const light = document.documentElement.classList.toggle("light");
  document.documentElement.classList.toggle("dark", !light);
  try {
    localStorage.setItem("hotelsys-theme", light ? "light" : "dark");
  } catch {}
};
$("menu").onclick = () => {
  $("sidebar").classList.toggle("open");
  $("menu").setAttribute(
    "aria-expanded",
    String($("sidebar").classList.contains("open")),
  );
};
document.querySelectorAll(".sidebar nav a").forEach(
  (a) =>
    (a.onclick = () => {
      document
        .querySelectorAll(".sidebar nav a")
        .forEach((n) => n.classList.remove("active"));
      a.classList.add("active");
      $("sidebar").classList.remove("open");
      $("menu").setAttribute("aria-expanded", "false");
    }),
);
updateEditor();
formal();
metrics();
run();
