import { type PropertyKey } from "@ecma";
import { type Operation } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-named-property-getter */
export const NamedPropertyGetter: unique symbol = Symbol.for(
  "@t15i/web-spec/webidl/NamedPropertyGetter",
);

export type NamedPropertyGetter = Operation<[PropertyKey], unknown>;

declare module "@webidl" {
  interface Interface {
    [NamedPropertyGetter]?: NamedPropertyGetter;
  }
}
