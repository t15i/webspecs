import { toBigInt } from "@ecma";
import { type BigIntType } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#js-bigint */
export function asBigInt(this: BigIntType, v: unknown): bigint {
  return toBigInt(v);
}

export * from "./converted-to-a-numeric-type-or-bigint";
