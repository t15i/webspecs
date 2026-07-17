import { type PropertyName } from "@ecma";
import { PlatformObject } from "@webidl";

export const ExistingNamedPropertyDeleter: unique symbol = Symbol(
  "ExistingNamedPropertyDeleter",
);

declare module "@webidl" {
  interface InterfaceMembers {
    [ExistingNamedPropertyDeleter]?(index: PropertyName): void;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-delete-an-existing-named-property */
export function deleteExistingNamedProperty(
  o: PlatformObject,
  property: PropertyName,
): void {
  return PlatformObject.getPrimaryInterfaceOf(o).members[
    ExistingNamedPropertyDeleter
  ]!.call(o, property);
}
