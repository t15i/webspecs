import {
  isAnnotatedWithExtAttribute,
  PlatformObject,
  type InterfaceExtendedAttributes,
  type InterfaceMembers,
} from "@webidl";

import { isPlatformObject } from "./is-a-platform-object";
import type { PropertyKey } from "@ecma";

export function implementsInterfaceWith(
  o: object,
  key: PropertyKey,
): key is keyof InterfaceMembers & PropertyKey {
  return (
    isPlatformObject(o) &&
    key in PlatformObject.getPrimaryInterfaceOf(o).members
  );
}

export function implementsInterfaceWithExtAttribute(
  o: object,
  key: keyof InterfaceExtendedAttributes,
): boolean {
  return (
    isPlatformObject(o) &&
    isAnnotatedWithExtAttribute(PlatformObject.getPrimaryInterfaceOf(o), key)
  );
}
