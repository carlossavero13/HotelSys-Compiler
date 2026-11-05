import { it, expect } from "vitest";
import { simulate, simulateNFA, transition } from "../src/compiler/automata.js";
it("AFD y AFND reconocen exactamente H seguido de tres dígitos", () => {
  for (const value of [
    "",
    "H",
    "H2",
    "H20",
    "H203",
    "H504",
    "H000",
    "H999",
    "H2034",
    "h203",
    "X203",
    "H2A3",
    " H203",
    "H203\n",
  ]) {
    expect(simulate(value).accepted).toBe(/^H[0-9]{3}$/.test(value));
    expect(simulateNFA(value).accepted).toBe(simulate(value).accepted);
  }
});
it("qr es absorbente y exceso de entrada rechaza", () => {
  expect(transition("qr", "H")).toBe("qr");
  expect(transition("q4", "2")).toBe("qr");
  expect(simulate("H203").path).toEqual(["q0", "q1", "q2", "q3", "q4"]);
});
