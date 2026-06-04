import { type PropertyKey } from "@ecma";
import { type Operation } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-named-property-setter */
export const NamedPropertySetter: unique symbol = Symbol.for(
  "@t15i/webspecs/webidl/NamedPropertySetter",
);

export type NamedPropertySetter = Operation<[PropertyKey, unknown], boolean>;

declare module "@webidl" {
  interface Interface {
    [NamedPropertySetter]?: NamedPropertySetter;
  }
}
