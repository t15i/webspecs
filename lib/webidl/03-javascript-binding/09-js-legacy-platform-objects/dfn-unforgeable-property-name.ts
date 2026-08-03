import {
  PlatformObject,
  type Identifier,
  type Interface,
  isUnforgeableOnInterface,
} from "@webidl";

export function isUnforgeablePropertyName(
  o: PlatformObject,
  propertyName: Identifier,
): boolean {
  let i: Interface | null = PlatformObject.getPrimaryInterfaceOf(o);

  while (i !== null) {
    if (isUnforgeableOnInterface(i, propertyName)) {
      return true;
    }
    i = i.inherit;
  }

  return false;
}
