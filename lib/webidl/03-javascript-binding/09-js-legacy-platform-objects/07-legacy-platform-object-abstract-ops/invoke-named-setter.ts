import type { PropertyName } from "@ecma";

import {
  type PlatformObject,
  type ImplementsInterfaceWith,
  NamedPropertySetter,
  PrimaryInterface,
  isSupportedPropertyName,
  setValueOfExistingNamedProperty,
  setValueOfNewNamedProperty,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#invoke-named-setter */
export function invokeNamedPropertySetter(
  o: ImplementsInterfaceWith<PlatformObject, typeof NamedPropertySetter>,
  p: PropertyName,
  v: unknown,
): void {
  const creating = !isSupportedPropertyName(o, p);
  const operation = o[PrimaryInterface][NamedPropertySetter];
  const T = operation.arguments[1].type;
  const value = T(v);

  if (operation.identifier === null) {
    if (creating === true) {
      setValueOfNewNamedProperty(o, p, value);
    } else {
      setValueOfExistingNamedProperty(o, p, value);
    }
  } else {
    operation.methodSteps.call(o, p, value);
  }
}
