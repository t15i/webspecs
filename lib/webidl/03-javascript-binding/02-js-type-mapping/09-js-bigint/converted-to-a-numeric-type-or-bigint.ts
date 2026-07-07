import { isBigInt, toNumeric } from "@ecma";
import type { Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#converted-to-a-numeric-type-or-bigint */
export function asNumericOrBigint<T>(this: Type<T>, v: unknown): T | bigint {
  const x = toNumeric(v);
  if (isBigInt(x)) {
    return x;
  }
  return this(x);
}
