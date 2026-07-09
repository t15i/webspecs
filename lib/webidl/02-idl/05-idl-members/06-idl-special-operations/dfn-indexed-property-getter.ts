import { type Operation, type Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-indexed-property-getter */
export const IndexedPropertyGetter: unique symbol = Symbol(
  "IndexedPropertyGetter",
);

export type IndexedPropertyGetter = Operation<[Type<number>], Type>;

declare module "@webidl" {
  interface InterfaceMembers {
    [IndexedPropertyGetter]?: IndexedPropertyGetter;
  }
}
