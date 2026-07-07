import type { PropertyName } from "@ecma";

import {
  PlatformObject,
  NamedPropertySetter,
  isSupportedPropertyName,
  setValueOfExistingNamedProperty,
  setValueOfNewNamedProperty,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#invoke-named-setter */
export function invokeNamedPropertySetter(
  o: PlatformObject,
  p: PropertyName,
  v: unknown,
): void {
  const creating = !isSupportedPropertyName(o, p);
  const operation =
    PlatformObject.getPrimaryInterfaceOf(o).members[NamedPropertySetter]!;
  const T = operation.arguments[1].type;
  const value = T(v);

  if (operation.identifier === undefined) {
    if (creating === true) {
      setValueOfNewNamedProperty(o, p, value);
    } else {
      setValueOfExistingNamedProperty(o, p, value);
    }
  } else {
    operation.methodSteps.call(o, p, value);
  }
}
