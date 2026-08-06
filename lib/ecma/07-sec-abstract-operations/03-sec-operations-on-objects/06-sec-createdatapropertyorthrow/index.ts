import { createDataProperty } from "@ecma";
import type { PropertyKey } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createdatapropertyorthrow */
export function createDataPropertyOrThrow(
  o: object,
  p: PropertyKey,
  v: unknown,
): void {
  const success = createDataProperty(o, p, v);
  if (success === false) {
    throw TypeError(`Cannot create data property "${String(p)}".`);
  }
}
