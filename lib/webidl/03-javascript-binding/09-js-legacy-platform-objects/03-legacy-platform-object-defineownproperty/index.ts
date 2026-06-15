import {
  isDataDescriptor,
  isString,
  ordinaryDefineOwnProperty,
  type PropertyKey,
} from "@ecma";

import {
  type PlatformObject,
  Global,
  LegacyOverrideBuiltIns,
  IndexedPropertySetter,
  NamedPropertySetter,
  isSupportedPropertyName,
  supportsIndexedProperties,
  supportsNamedProperties,
  implementsInterfaceWith,
  implementsInterfaceWithExtAttribute,
  isUnforgeablePropertyName,
  invokeIndexedPropertySetter,
  invokeNamedPropertySetter,
  isArrayIndex,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#legacy-platform-object-defineownproperty */
export function defineOwnProperty(
  o: PlatformObject,
  p: PropertyKey,
  desc: PropertyDescriptor,
): boolean {
  if (supportsIndexedProperties(o) && isArrayIndex(p)) {
    if (isDataDescriptor(desc) === false) {
      return false;
    }

    if (!implementsInterfaceWith(o, IndexedPropertySetter)) {
      return false;
    }

    invokeIndexedPropertySetter(o, p, desc.value);

    return true;
  }

  if (
    supportsNamedProperties(o) &&
    !implementsInterfaceWithExtAttribute(o, Global) &&
    isString(p) &&
    !isUnforgeablePropertyName(o, p)
  ) {
    const creating = !isSupportedPropertyName(o, p);

    if (
      implementsInterfaceWithExtAttribute(o, LegacyOverrideBuiltIns) ||
      Object.hasOwn(o, p)
    ) {
      if (
        creating === false &&
        !implementsInterfaceWith(o, NamedPropertySetter)
      ) {
        return false;
      }

      if (implementsInterfaceWith(o, NamedPropertySetter)) {
        if (isDataDescriptor(desc) === false) {
          return false;
        }

        invokeNamedPropertySetter(o, p, desc.value);

        return true;
      }
    }
  }

  return ordinaryDefineOwnProperty(o, p, desc);
}
