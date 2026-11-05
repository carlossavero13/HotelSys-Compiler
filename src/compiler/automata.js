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
// AFND with epsilon initial edge, equivalent by subset construction.
export function simulateNFA(input) {
  let state = "q0";
  const path = ["s", "q0"];
  for (const char of input) {
    state = transition(state, char);
    if (state === "qr") {
      path.push("∅");
      return { path, accepted: false };
    }
    path.push(state);
  }
  return { path, accepted: state === "q4" };
}
