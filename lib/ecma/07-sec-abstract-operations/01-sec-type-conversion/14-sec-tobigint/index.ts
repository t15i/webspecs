import { toPrimitive } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tobigint */
export function toBigInt(argument: unknown): bigint {
  const prim = toPrimitive(argument, "number");
  if (typeof prim === "number") {
    throw TypeError("Cannot convert a Number value to a BigInt");
  }
  return BigInt(prim as bigint | boolean | string);
}
