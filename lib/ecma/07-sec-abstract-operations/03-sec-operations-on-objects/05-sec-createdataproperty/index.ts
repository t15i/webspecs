import type { PropertyKey } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createdataproperty */
export function createDataProperty(
  obj: object,
  propertyKey: PropertyKey,
  value: unknown,
): boolean {
  const newDesc: PropertyDescriptor = {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  };

  return Reflect.defineProperty(obj, propertyKey, newDesc);
}
