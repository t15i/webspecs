import { type Operation } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-indexed-property-setter */
export const IndexedPropertySetter: unique symbol = Symbol.for(
  "@t15i/webspecs/webidl/IndexedPropertySetter",
);

declare module "@webidl" {
  interface InterfaceMembers {
    [IndexedPropertySetter]?: Operation<[number, unknown], unknown>;
  }
}
