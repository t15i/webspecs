import { toFixedSizeInteger, toIntegerOrInfinity } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-touint32 */
export function toUint32(argument: unknown): number {
  const int = toIntegerOrInfinity(argument);
  return toFixedSizeInteger(int, "unsigned", 32);
}
