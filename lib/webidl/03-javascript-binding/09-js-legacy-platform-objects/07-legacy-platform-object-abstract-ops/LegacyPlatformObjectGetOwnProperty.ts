import { ordinaryGetOwnProperty, toUint32, type PropertyName } from "@ecma";

import {
  type PlatformObject,
  NamedPropertyGetter,
  NamedPropertySetter,
  IndexedPropertyGetter,
  IndexedPropertySetter,
  LegacyUnenumerableNamedProperties,
  PrimaryInterface,
  supportsIndexedProperties,
  supportsNamedProperties,
  isSupportedPropertyIndex,
  determineValueOfIndexedProperty,
  determineValueOfNamedProperty,
  implementsInterfaceWith,
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
      const operation = o[PrimaryInterface][IndexedPropertyGetter];

      let value;
      if (operation.identifier === null) {
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
      const operation = o[PrimaryInterface][NamedPropertyGetter];

      let value;
      if (operation.identifier === null) {
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

      if (implementsInterfaceWith(o, LegacyUnenumerableNamedProperties)) {
        desc.enumerable = false;
      } else {
        desc.enumerable = true;
      }

      desc.configurable = true;
    }
  }

  return ordinaryGetOwnProperty(o, p);
}
