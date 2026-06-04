import { modulo } from "@ecma";

import { integerPart } from "./abstract-opdef-integerpart";

/** https://webidl.spec.whatwg.org/#abstract-opdef-converttoint */
export function convertToInt(
  value: unknown,
  bitLength: number,
  signedness?: "signed" | "unsigned",
): number {
  let x = Number(value);

  if (!Number.isFinite(x)) {
    return 0;
  }

  x = modulo(integerPart(x), Math.pow(2, bitLength));

  if (signedness === "signed" && x >= Math.pow(2, bitLength - 1)) {
    return x - Math.pow(2, bitLength);
  }

  return x;
}
