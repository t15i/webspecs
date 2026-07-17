import type { NamedPropertyGetterOperation } from "./02-idl-named-properties";

/** @see https://webidl.spec.whatwg.org/#dfn-named-property-getter */
export const NamedPropertyGetter: unique symbol = Symbol("NamedPropertyGetter");

declare module "@webidl" {
  interface InterfaceMembers {
    [NamedPropertyGetter]?: NamedPropertyGetterOperation;
  }
}
