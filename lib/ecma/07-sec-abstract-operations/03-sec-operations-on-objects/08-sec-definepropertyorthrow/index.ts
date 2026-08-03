import type { PropertyKey } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-definepropertyorthrow */
export function definePropertyOrThrow(
  o: object,
  p: PropertyKey,
  desc: PropertyDescriptor,
): void {
  const success = Reflect.defineProperty(o, p, desc);
  if (success === false) {
    throw TypeError(`Cannot define property "${String(p)}".`);
  }
}
