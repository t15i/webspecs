import { toUint32 } from "@ecma";

import {
  type PlatformObject,
  IndexedPropertySetter,
  PrimaryInterface,
  isSupportedPropertyIndex,
  setValueOfExistingIndexedProperty,
  setValueOfNewIndexedProperty,
  type ImplementsInterfaceWith,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#invoke-indexed-setter */
export function invokeIndexedPropertySetter(
  o: ImplementsInterfaceWith<PlatformObject, typeof IndexedPropertySetter>,
  p: PropertyKey,
  v: unknown,
): void {
  const index = toUint32(p);
  const creating = !isSupportedPropertyIndex(o, index);
  const operation = o[PrimaryInterface].members[IndexedPropertySetter];
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
