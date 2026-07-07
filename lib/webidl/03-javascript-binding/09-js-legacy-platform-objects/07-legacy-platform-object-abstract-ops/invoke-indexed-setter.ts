import { toUint32 } from "@ecma";

import {
  PlatformObject,
  IndexedPropertySetter,
  isSupportedPropertyIndex,
  setValueOfExistingIndexedProperty,
  setValueOfNewIndexedProperty,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#invoke-indexed-setter */
export function invokeIndexedPropertySetter(
  o: PlatformObject,
  p: PropertyKey,
  v: unknown,
): void {
  const index = toUint32(p);
  const creating = !isSupportedPropertyIndex(o, index);
  const operation =
    PlatformObject.getPrimaryInterfaceOf(o).members[IndexedPropertySetter]!;
  const T = operation.arguments[1].type;
  const value = T(v);

  if (operation.identifier === undefined) {
    if (creating === true) {
      setValueOfNewIndexedProperty(o, index, value);
    } else {
      setValueOfExistingIndexedProperty(o, index, value);
    }
  } else {
    operation.methodSteps.call(o, index, value);
  }
}
