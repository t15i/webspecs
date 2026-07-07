import { isCallable } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getmethod */
export function getMethod(
  v: object,
  p: PropertyKey,
): CallableFunction | undefined {
  const func = (v as Record<PropertyKey, unknown>)[p];
  if (func === undefined || func === null) {
    return undefined;
  }
  if (!isCallable(func)) {
    throw TypeError(`Property ${String(p)} is not callable`);
  }
  return func;
}
