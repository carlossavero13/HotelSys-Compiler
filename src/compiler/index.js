import antlr4 from "antlr4";
import HotelSysLexer from "../generated/HotelSysLexer.js";
import HotelSysParser from "../generated/HotelSysParser.js";
import { ASTBuilder } from "./ast.js";
import { validate, limaDate } from "../semantic/rules.js";
import { generate } from "../codegen/generate.js";

export const TOKEN_NAMES = [
  "RESERVA",
  "CLIENTE",
  "HABITACION",
  "FECHA",
  "NOCHES",
  "PERSONAS",
  "IGUAL",
  "COD_HABITACION",
  "FECHA_VALOR",
  "ENTERO",
  "IDENTIFICADOR",
].map((n) => "TOKEN_" + n);
class Errors extends antlr4.error.ErrorListener {
  constructor(type, input, output) {
    super();
    Object.assign(this, { type, input, output });
  }
  syntaxError(recognizer, symbol, line, column, message) {
    this.output.push({
      type: this.type,
      code: this.type === "lexical" ? "LEX01" : "SYN01",
      message,
      line,
      column: column + 1,
      fragment:
        symbol?.text ?? this.input.split(/\r?\n/)[line - 1]?.[column] ?? "",
      suggestion:
        this.type === "lexical"
          ? "Usa A–Z, dígitos, =, guiones y espacios permitidos."
          : "Respeta RESERVA CLIENTE=… HABITACION=… FECHA=… NOCHES=… PERSONAS=… y el orden de campos.",
    });
  }
}
function serializeTree(node, parser) {
  if (node.symbol) return { name: node.getText() };
  return {
    name: parser.ruleNames[node.ruleIndex],
    children: (node.children ?? []).map((child) =>
      serializeTree(child, parser),
    ),
  };
}
export function derive(tree) {
  if (!tree) return [];
  const frontier = [tree];
  const steps = [tree.name];
  while (frontier.some((node) => node.children)) {
    const i = frontier.findIndex((node) => node.children);
    frontier.splice(i, 1, ...frontier[i].children);
    steps.push(frontier.map((node) => node.name).join(" "));
  }
  return steps;
}
export function compile(input, options = {}) {
  const start = performance.now();
  const errors = [];
  const referenceDate = options.referenceDate ?? limaDate();
  const lexer = new HotelSysLexer(new antlr4.InputStream(input));
  lexer.removeErrorListeners();
  lexer.addErrorListener(new Errors("lexical", input, errors));
  const stream = new antlr4.CommonTokenStream(lexer);
  stream.fill();
  const tokens = stream.tokens
    .filter((t) => t.type !== antlr4.Token.EOF)
    .map((t) => ({
      type: TOKEN_NAMES[t.type - 1],
      value: t.text,
      line: t.line,
      column: t.column + 1,
      pos: t.start,
    }));
  let ast = null,
    tree = null,
    rules = [],
    codeGen = null;
  if (!errors.length) {
    stream.seek(0);
    const parser = new HotelSysParser(stream);
    parser.buildParseTrees = true;
    parser.removeErrorListeners();
    parser.addErrorListener(new Errors("syntactic", input, errors));
    const parsed = parser.reserva();
    tree = serializeTree(parsed, parser);
    // ANTLR recovery may build a tree, but NEVER authorizes AST or code generation.
    if (!errors.length) {
      ast = new ASTBuilder().visit(parsed);
      rules = validate(ast, { ...options, referenceDate });
      for (const rule of rules.filter((r) => !r.passed)) {
        const keyword =
          rule.field === "habitacion" ? "HABITACION" : rule.field.toUpperCase();
        const index = tokens.findIndex((t) => t.value === keyword);
        const tok = tokens[index + 2];
        errors.push({
          type: "semantic",
          code: rule.code,
          message: rule.message,
          line: tok?.line,
          column: tok?.column,
          fragment: tok?.value,
          suggestion: rule.suggestion,
        });
      }
      if (!errors.length) codeGen = generate(ast);
    }
  }
  return {
    input,
    valid: errors.length === 0,
    type: errors[0]?.type ?? "valid",
    tokens,
    errors,
    ast,
    tree,
    derivations: derive(tree),
    rules,
    codeGen,
    referenceDate,
    timezone: "America/Lima",
    elapsed: performance.now() - start,
  };
}
