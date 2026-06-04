import {
  type PropertyName,
  isString,
  ordinarySetWithOwnDescriptor,
} from "@ecma";

import {
  type PlatformObject,
  IndexedPropertySetter,
  NamedPropertySetter,
  implementsInterfaceWith,
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
  if (Object.is(o, receiver)) {
    if (implementsInterfaceWith(o, IndexedPropertySetter) && isArrayIndex(p)) {
      invokeIndexedPropertySetter(o, p, v);
      return true;
    }

    if (implementsInterfaceWith(o, NamedPropertySetter) && isString(p)) {
      invokeNamedPropertySetter(o, p, v);
      return true;
    }
  }

  const ownDesc = legacyPlatformObjectGetOwnProperty(o, p, true);

  return ordinarySetWithOwnDescriptor(o, p, v, receiver, ownDesc);
}
