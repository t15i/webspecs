/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tobigint */
export function toBigInt(argument: unknown): bigint {
  if (typeof argument === "number") {
    throw TypeError("Cannot convert a Number value to a BigInt");
  }
  return BigInt(argument as bigint | boolean | string);
}
