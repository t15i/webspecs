import { sign } from "@ecma";

/** @see https://webidl.spec.whatwg.org/#abstract-opdef-integerpart */
export function integerPart(n: number): number {
  return sign(n) * Math.floor(Math.abs(n));
}
