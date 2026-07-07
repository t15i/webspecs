/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber */
export function toNumber(argument: unknown): number {
  return +(argument as number);
}
