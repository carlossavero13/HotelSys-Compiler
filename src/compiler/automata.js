// AFD total para el patrón de habitación, no para el lexer completo.
export const DFA_STATES = ["q0", "q1", "q2", "q3", "q4", "qr"];
export function transition(state, char) {
  if (state === "q0" && char === "H") return "q1";
  if (["q1", "q2", "q3"].includes(state) && /^[0-9]$/.test(char))
    return `q${Number(state[1]) + 1}`;
  return "qr";
}
export function simulate(input) {
  let state = "q0";
  const path = [state];
  for (const char of input) {
    state = transition(state, char);
    path.push(state);
  }
  return { path, accepted: state === "q4" };
}
// AFND-ε documentado en §1.3.5: ramas par/impar tras reconocer H.
export const NFA_STATES = ["n0", "n1", "n2", "n3", "n4", "n5", "n6"];
export function nfaTransition(state, symbol) {
  if (state === "n0" && symbol === "H") return ["n1"];
  if (state === "n1" && symbol === "ε") return ["n2", "n3"];
  if (state === "n2" && /^[02468]$/.test(symbol)) return ["n4"];
  if (state === "n3" && /^[13579]$/.test(symbol)) return ["n4"];
  if (state === "n4" && /^[0-9]$/.test(symbol)) return ["n5"];
  if (state === "n5" && /^[0-9]$/.test(symbol)) return ["n6"];
  return [];
}
export function epsilonClosure(states) {
  const closure = new Set(states);
  for (const state of closure)
    for (const next of nfaTransition(state, "ε")) closure.add(next);
  return [...closure];
}
export function simulateNFA(input) {
  let states = epsilonClosure(["n0"]);
  const subsets = [states];
  for (const char of input) {
    // Input ε is not an alphabet symbol; epsilon edges do not consume input.
    states = epsilonClosure(
      char === "ε" ? [] : states.flatMap((state) => nfaTransition(state, char)),
    );
    subsets.push(states);
  }
  return {
    subsets,
    path: subsets.map((set) => (set.length ? `{${set.join(", ")}}` : "∅")),
    accepted: states.includes("n6"),
  };
}
