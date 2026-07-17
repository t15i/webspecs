import type { IndexedPropertyGetterOperation } from "./01-idl-indexed-properties";

/** @see https://webidl.spec.whatwg.org/#dfn-indexed-property-getter */
export const IndexedPropertyGetter: unique symbol = Symbol(
  "IndexedPropertyGetter",
);

declare module "@webidl" {
  interface InterfaceMembers {
    [IndexedPropertyGetter]?: IndexedPropertyGetterOperation;
  }
}
