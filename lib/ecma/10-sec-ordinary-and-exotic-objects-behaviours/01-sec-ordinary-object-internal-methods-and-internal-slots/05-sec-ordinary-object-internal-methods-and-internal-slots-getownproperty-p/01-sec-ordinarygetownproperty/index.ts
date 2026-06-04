import type {} from "@ecma";

export function ordinaryGetOwnProperty(
  obj: object,
  propertyKey: PropertyKey,
): PropertyDescriptor | undefined {
  return Object.getOwnPropertyDescriptor(obj, propertyKey);
}
