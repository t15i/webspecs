import {
  isAnnotatedWithExtAttribute,
  PlatformObject,
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
