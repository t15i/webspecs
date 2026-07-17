import type { IndexedPropertySetterOperation } from "./01-idl-indexed-properties";

/** @see https://webidl.spec.whatwg.org/#dfn-indexed-property-setter */
export const IndexedPropertySetter: unique symbol = Symbol(
  "IndexedPropertySetter",
);

declare module "@webidl" {
  interface InterfaceMembers {
    [IndexedPropertySetter]?: IndexedPropertySetterOperation;
  }
}
