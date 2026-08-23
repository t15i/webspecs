import {
  type PropertyName,
  isString,
  ordinarySetWithOwnDescriptor,
} from "@ecma";

import {
  PlatformObject,
  invokeIndexedPropertySetter,
  invokeNamedPropertySetter,
  isArrayIndex,
  legacyPlatformObjectGetOwnProperty,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#legacy-platform-object-set */
export function set<T>(
  o: PlatformObject,
  p: PropertyName,
  v: T,
  receiver: object,
): boolean {
  const iface = PlatformObject.getPrimaryInterfaceOf(o);

  if (Object.is(o, receiver)) {
    if (iface.indexedPropertySetter !== undefined && isArrayIndex(p)) {
      invokeIndexedPropertySetter(o, p, v);
      return true;
    }

    if (iface.namedPropertySetter !== undefined && isString(p)) {
      invokeNamedPropertySetter(o, p, v);
      return true;
    }
  }

  const ownDesc = legacyPlatformObjectGetOwnProperty(o, p, true);

  return ordinarySetWithOwnDescriptor(o, p, v, receiver, ownDesc);
}
