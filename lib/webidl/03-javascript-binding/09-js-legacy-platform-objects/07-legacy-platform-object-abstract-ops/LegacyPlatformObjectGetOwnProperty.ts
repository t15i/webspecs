import { ordinaryGetOwnProperty, toUint32, type PropertyName } from "@ecma";

import {
  PlatformObject,
  NamedPropertyGetter,
  NamedPropertySetter,
  IndexedPropertyGetter,
  IndexedPropertySetter,
  LegacyUnenumerableNamedProperties,
  supportsIndexedProperties,
  supportsNamedProperties,
  isSupportedPropertyIndex,
  determineValueOfIndexedProperty,
  determineValueOfNamedProperty,
  implementsInterfaceWith,
  implementsInterfaceWithExtAttribute,
} from "@webidl";

import { isNamedPropertyVisible } from "./dfn-named-property-visibility";
import { isArrayIndex } from "./is-an-array-index";

export function legacyPlatformObjectGetOwnProperty(
  o: PlatformObject,
  p: PropertyName,
  ignoreNamedProps: boolean,
): PropertyDescriptor | undefined {
  if (supportsIndexedProperties(o) && isArrayIndex(p)) {
    const index = toUint32(p);

    if (isSupportedPropertyIndex(o, index)) {
      const operation =
        PlatformObject.getPrimaryInterfaceOf(o).members[IndexedPropertyGetter]!;

      let value;
      if (operation.identifier === undefined) {
        value = determineValueOfIndexedProperty(o, index);
      } else {
        value = operation.methodSteps.call(o, index);
      }

      const desc: PropertyDescriptor = {};

      desc.value = value;

      if (implementsInterfaceWith(o, IndexedPropertySetter)) {
        desc.writable = true;
      } else {
        desc.writable = false;
      }

      desc.enumerable = true;
      desc.configurable = true;

      return desc;
    }

    ignoreNamedProps = true;
  }

  if (supportsNamedProperties(o) && ignoreNamedProps === false) {
    if (isNamedPropertyVisible(p, o)) {
      const operation =
        PlatformObject.getPrimaryInterfaceOf(o).members[NamedPropertyGetter]!;

      let value;
      if (operation.identifier === undefined) {
        value = determineValueOfNamedProperty(o, p);
      } else {
        value = operation.methodSteps.call(o, p);
      }

      const desc: PropertyDescriptor = {};

      desc.value = value;

      if (implementsInterfaceWith(o, NamedPropertySetter)) {
        desc.writable = true;
      } else {
        desc.writable = false;
      }

      if (
        implementsInterfaceWithExtAttribute(
          o,
          LegacyUnenumerableNamedProperties,
        )
      ) {
        desc.enumerable = false;
      } else {
        desc.enumerable = true;
      }

      desc.configurable = true;

      return desc;
    }
  }

  return ordinaryGetOwnProperty(o, p);
}
