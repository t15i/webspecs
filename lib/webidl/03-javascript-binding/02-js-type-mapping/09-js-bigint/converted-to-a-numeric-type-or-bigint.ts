import { isBigInt, toNumeric } from "@ecma";
import type { NumericType } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#converted-to-a-numeric-type-or-bigint */
export function asNumericOrBigint(T: NumericType, v: unknown): number | bigint {
  const x = toNumeric(v);
  if (isBigInt(x)) {
    return x;
  }
  return T(x);
}
