import { isObject } from "@ecma";
import {
  isAnnotatedWithExtAttribute,
  PlatformObject,
  type Interface,
  type InterfaceExtendedAttributes,
  type InterfaceMembers,
} from "@webidl";

import type { PropertyKey } from "@ecma";

export function implementsInterfaceWith(
  o: object,
  key: PropertyKey,
): key is keyof InterfaceMembers & PropertyKey {
  const primaryInterface = PlatformObject.getPrimaryInterfaceOf(o);
  return primaryInterface !== undefined && key in primaryInterface.members;
}

export function implementsInterfaceWithExtAttribute(
  o: object,
  key: keyof InterfaceExtendedAttributes,
): boolean {
  const iface = PlatformObject.getPrimaryInterfaceOf(o);
  return iface !== undefined && isAnnotatedWithExtAttribute(iface, key);
}

/**
 * Tests whether an object implements an interface: its primary interface is
 * that interface or one that inherits it, walked through each interface's
 * `inherit` reference. A non-object never implements an interface.
 *
 * @see https://webidl.spec.whatwg.org/#implements
 */
export function implementsInterface(o: unknown, iface: Interface): boolean {
  if (!isObject(o)) {
    return false;
  }

  let i: Interface | null | undefined = PlatformObject.getPrimaryInterfaceOf(o);
  while (i !== null && i !== undefined) {
    if (i === iface) {
      return true;
    }
    i = i.inherit;
  }

  return false;
}
