import { type Operation } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-indexed-property-getter */
export const IndexedPropertyGetter: unique symbol = Symbol.for(
  "@t15i/webspecs/webidl/IndexedPropertyGetter",
);

export type IndexedPropertyGetter = Operation<[number], unknown>;

declare module "@webidl" {
  interface Interface {
    [IndexedPropertyGetter]?: IndexedPropertyGetter;
  }
}
