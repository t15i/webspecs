import { type PropertyKey, toString } from "@ecma";

import {
  PlatformObject,
  supportsIndexedProperties,
  supportsNamedProperties,
  isNamedPropertyVisible,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#legacy-platform-object-ownpropertykeys */
export function ownPropertyKeys(o: PlatformObject): PropertyKey[] {
  const iface = PlatformObject.getPrimaryInterfaceOf(o);

  const keys: PropertyKey[] = [];

  if (supportsIndexedProperties(o)) {
    const supportedPropertyIndices =
      iface.behaviors.supportedPropertyIndices!.call(o);

    for (const index of supportedPropertyIndices) {
      keys.push(toString(index));
    }
  }

  if (supportsNamedProperties(o)) {
    const supportedPropertyNames =
      iface.behaviors.supportedPropertyNames!.call(o);

    for (const p of supportedPropertyNames) {
      if (isNamedPropertyVisible(p, o)) {
        keys.push(p);
      }
    }
  }

  for (const p of Object.getOwnPropertyNames(o)) {
    keys.push(p);
  }

  for (const p of Object.getOwnPropertySymbols(o)) {
    keys.push(p);
  }

  return keys;
}
