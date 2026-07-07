import { isBigInt, toNumber, toPrimitive } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumeric */
export function toNumeric(value: unknown): number | bigint {
  const primValue = toPrimitive(value, "number");
  if (isBigInt(primValue)) {
    return primValue;
  }
  return toNumber(primValue);
}
