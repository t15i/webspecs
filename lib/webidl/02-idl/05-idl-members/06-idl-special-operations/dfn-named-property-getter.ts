import { type PropertyName } from "@ecma";
import { type SpecialOperation, type Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-named-property-getter */
export const NamedPropertyGetter: unique symbol = Symbol("NamedPropertyGetter");

export type NamedPropertyGetter = SpecialOperation<[Type<PropertyName>], Type>;

declare module "@webidl" {
  interface InterfaceMembers {
    [NamedPropertyGetter]?: NamedPropertyGetter;
  }
}
