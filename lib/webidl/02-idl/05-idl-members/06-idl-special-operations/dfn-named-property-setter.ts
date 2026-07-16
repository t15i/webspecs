import { type PropertyName } from "@ecma";
import { type SpecialOperation, type Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-named-property-setter */
export const NamedPropertySetter: unique symbol = Symbol("NamedPropertySetter");

export type NamedPropertySetter = SpecialOperation<
  [Type<PropertyName>, Type],
  Type
>;

declare module "@webidl" {
  interface InterfaceMembers {
    [NamedPropertySetter]?: NamedPropertySetter;
  }
}
