import { type PropertyName, toUint32 } from "@ecma";
import { failure } from "@share";

import {
  PlatformObject,
  NamedPropertyDeleter,
  Global,
  deleteExistingNamedProperty,
  isSupportedPropertyIndex,
  supportsIndexedProperties,
  supportsNamedProperties,
  implementsInterfaceWith,
  implementsInterfaceWithExtAttribute,
  isArrayIndex,
  isBooleanType,
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
    !implementsInterfaceWithExtAttribute(o, Global) &&
    isNamedPropertyVisible(p, o)
  ) {
    if (!implementsInterfaceWith(o, NamedPropertyDeleter)) {
      return false;
    }

    const operation =
      PlatformObject.getPrimaryInterfaceOf(o).members[NamedPropertyDeleter]!;

    if (operation.identifier === undefined) {
      const result = deleteExistingNamedProperty(o, p);

      if (result === failure) {
        return false;
      }
    } else {
      const result = operation.methodSteps.call(o, p);

      if (isBooleanType(operation.returnType) && result === false) {
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
