import { type SpecialOperation, type Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-indexed-property-setter */
export const IndexedPropertySetter: unique symbol = Symbol(
  "IndexedPropertySetter",
);

export type IndexedPropertySetter = SpecialOperation<
  [Type<number>, Type],
  Type
>;

declare module "@webidl" {
  interface InterfaceMembers {
    [IndexedPropertySetter]?: IndexedPropertySetter;
  }
}
