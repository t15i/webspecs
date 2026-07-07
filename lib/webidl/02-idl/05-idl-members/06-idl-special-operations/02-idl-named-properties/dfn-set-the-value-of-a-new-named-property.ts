import { type PropertyName } from "@ecma";
import { PlatformObject } from "@webidl";

export const NewNamedPropertySetter: unique symbol = Symbol(
  "NewNamedPropertySetter",
);

declare module "@webidl" {
  interface InterfaceMembers {
    [NewNamedPropertySetter]?(index: PropertyName, value: unknown): void;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-a-new-named-property */
export function setValueOfNewNamedProperty(
  o: PlatformObject,
  property: PropertyName,
  value: unknown,
): void {
  PlatformObject.getPrimaryInterfaceOf(o).members[NewNamedPropertySetter]!.call(
    o,
    property,
    value,
  );
}
