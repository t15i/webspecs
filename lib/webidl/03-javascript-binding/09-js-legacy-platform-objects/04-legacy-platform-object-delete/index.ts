import { type PropertyName, toUint32 } from "@ecma";

import {
  type PlatformObject,
  NamedPropertyDeleter,
  PrimaryInterface,
  Global,
  deleteExistingNamedProperty,
  isSupportedPropertyIndex,
  supportsIndexedProperties,
  supportsNamedProperties,
  implementsInterfaceWith,
  isArrayIndex,
  isNamedPropertyVisible,
} from "@webidl";

export function del(o: PlatformObject, p: PropertyName): boolean {
  if (supportsIndexedProperties(o) && isArrayIndex(p)) {
    const index = toUint32(p);

    if (!isSupportedPropertyIndex(o, index)) {
      return true;
    }

    return false;
  }

  if (
    supportsNamedProperties(o) &&
    !implementsInterfaceWith(o, Global) &&
    isNamedPropertyVisible(p, o)
  ) {
    if (!implementsInterfaceWith(o, NamedPropertyDeleter)) {
      return false;
    }

    const operation = o[PrimaryInterface][NamedPropertyDeleter]!;

    if (operation.identifier !== undefined) {
      const result = deleteExistingNamedProperty(o, p);

      if (result === false) {
        return false;
      }
    } else {
      const result = operation.methodSteps.call(o, p);

      if (result === false) {
        return false;
      }
    }

    return true;
  }

  if (Object.hasOwn(o, p)) {
    if (!Object.getOwnPropertyDescriptor(o, p)?.configurable) {
      return false;
    }

    delete o[p];
  }

  return true;
}
