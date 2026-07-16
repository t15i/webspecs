import { type PropertyName } from "@ecma";
import { type SpecialOperation, type Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-named-property-deleter */
export const NamedPropertyDeleter: unique symbol = Symbol(
  "NamedPropertyDeleter",
);

export type NamedPropertyDeleter = SpecialOperation<[Type<PropertyName>], Type>;

declare module "@webidl" {
  interface InterfaceMembers {
    [NamedPropertyDeleter]?: NamedPropertyDeleter;
  }
}
