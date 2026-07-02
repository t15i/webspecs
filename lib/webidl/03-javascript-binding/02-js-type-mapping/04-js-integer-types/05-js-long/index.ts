import { convertToInt, type LongType } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#js-long */
export function asLong(this: LongType, v: unknown): number {
  return convertToInt.call(this, v, 32, "signed");
}
