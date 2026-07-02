import type { DoubleType } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#js-double */
export function asDouble(this: DoubleType, v: unknown): number {
  const x = Number(v);

  if (!isFinite(x)) {
    throw TypeError("The provided double value is non-finite");
  }

  return x;
}
