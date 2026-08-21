import { getIteratorDirect, isObject } from "@ecma";
import type { IteratorRecord } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getiteratorfrommethod */
export function getIteratorFromMethod(
  obj: unknown,
  method: CallableFunction,
): IteratorRecord {
  const iterator: unknown = Reflect.apply(method, obj, []);

  if (!isObject(iterator)) {
    throw TypeError("The iterator method did not return an object");
  }

  return getIteratorDirect(iterator);
}
