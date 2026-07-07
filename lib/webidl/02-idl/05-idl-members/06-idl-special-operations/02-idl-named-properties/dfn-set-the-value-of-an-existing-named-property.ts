import { type PropertyName } from "@ecma";
import { PlatformObject } from "@webidl";

export const ExistingNamedPropertySetter: unique symbol = Symbol(
  "ExistingNamedPropertySetter",
);

declare module "@webidl" {
  interface InterfaceMembers {
    [ExistingNamedPropertySetter]?(index: PropertyName, value: unknown): void;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-an-existing-named-property */
export function setValueOfExistingNamedProperty(
  o: PlatformObject,
  property: PropertyName,
  value: unknown,
): void {
  PlatformObject.getPrimaryInterfaceOf(o).members[
    ExistingNamedPropertySetter
  ]!.call(o, property, value);
}
