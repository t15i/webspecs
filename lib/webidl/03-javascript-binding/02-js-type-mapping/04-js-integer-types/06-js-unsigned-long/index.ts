import { convertToInt, type UnsignedLongType } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#js-unsigned-long */
export function asUnsignedLong(this: UnsignedLongType, v: unknown): number {
  return convertToInt.call(this, v, 32, "unsigned");
}
