import type { PropertyName } from "@ecma";
import {
  type PlatformObject,
  LegacyOverrideBuiltIns,
  isSupportedPropertyName,
  isNamedPropertyObject,
  implementsInterfaceWithExtAttribute,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-named-property-visibility */
export function isNamedPropertyVisible(
  p: PropertyName,
  o: PlatformObject,
): boolean {
  if (!isSupportedPropertyName(o, p)) {
    return false;
  }

  if (Object.hasOwn(o, p)) {
    return false;
  }

  if (implementsInterfaceWithExtAttribute(o, LegacyOverrideBuiltIns)) {
    return true;
  }

  let prototype = Object.getPrototypeOf(o);

  while (prototype !== null) {
    if (!isNamedPropertyObject(prototype) && Object.hasOwn(prototype, p)) {
      return false;
    }

    prototype = Object.getPrototypeOf(prototype);
  }

  return true;
}
