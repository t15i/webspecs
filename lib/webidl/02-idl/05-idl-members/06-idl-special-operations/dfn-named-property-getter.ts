import { type PropertyName } from "@ecma";
import { type Operation } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-named-property-getter */
export const NamedPropertyGetter: unique symbol = Symbol.for(
  "@t15i/webspecs/webidl/NamedPropertyGetter",
);

export type NamedPropertyGetter = Operation<[PropertyName], unknown>;

declare module "@webidl" {
  interface InterfaceMembers {
    [NamedPropertyGetter]?: NamedPropertyGetter;
  }
}
