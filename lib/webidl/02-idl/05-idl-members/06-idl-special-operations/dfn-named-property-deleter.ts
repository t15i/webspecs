import { type PropertyName } from "@ecma";
import { type Operation, type Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-named-property-deleter */
export const NamedPropertyDeleter: unique symbol = Symbol(
  "NamedPropertyDeleter",
);

export type NamedPropertyDeleter = Operation<[Type<PropertyName>], Type>;

declare module "@webidl" {
  interface InterfaceMembers {
    [NamedPropertyDeleter]?: NamedPropertyDeleter;
  }
}
