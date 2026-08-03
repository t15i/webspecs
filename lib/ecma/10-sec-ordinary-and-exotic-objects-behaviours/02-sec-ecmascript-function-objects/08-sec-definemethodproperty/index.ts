import { definePropertyOrThrow } from "@ecma";
import type { PropertyKey } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-definemethodproperty */
export function defineMethodProperty(
  homeObject: object,
  // NOTE (PrivateName): cannot define PrivateElement in JS runtime
  key: PropertyKey,
  closure: CallableFunction,
  enumerable: boolean,
): void {
  const propertyDesc = {
    value: closure,
    writable: true,
    enumerable,
    configurable: true,
  };
  definePropertyOrThrow(homeObject, key, propertyDesc);
}
