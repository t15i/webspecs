import { isCallable } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getmethod */
export function getMethod(
  V: object,
  P: PropertyKey,
): CallableFunction | undefined {
  const func = (V as Record<PropertyKey, unknown>)[P];
  if (func === undefined || func === null) {
    return undefined;
  }
  if (!isCallable(func)) {
    throw TypeError(`Property ${String(P)} is not callable`);
  }
  return func;
}
