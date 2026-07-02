import { R, sign } from "@ecma";

/** @see https://webidl.spec.whatwg.org/#abstract-opdef-integerpart */
export function integerPart(n: number): number {
  const r = R(n);
  return R(sign(r) * Math.floor(Math.abs(r)));
}
