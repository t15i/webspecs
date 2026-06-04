import {
  type PlatformObject,
  type Identifier,
  PrimaryInterface,
  isUnforgeableOnInterface,
} from "@webidl";

export function isUnforgeablePropertyName(
  o: PlatformObject,
  propertyName: Identifier,
): boolean {
  let i = o[PrimaryInterface];

  while (i !== null) {
    if (isUnforgeableOnInterface(i, propertyName)) {
      return true;
    }
    i = Object.getPrototypeOf(i);
  }

  return false;
}
