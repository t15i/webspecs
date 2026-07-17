import type { NamedPropertySetterOperation } from "./02-idl-named-properties";

/** @see https://webidl.spec.whatwg.org/#dfn-named-property-setter */
export const NamedPropertySetter: unique symbol = Symbol("NamedPropertySetter");

declare module "@webidl" {
  interface InterfaceMembers {
    [NamedPropertySetter]?: NamedPropertySetterOperation;
  }
}
