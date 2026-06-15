import { type PropertyName } from "@ecma";
import { type Operation } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-named-property-deleter */
export const NamedPropertyDeleter: unique symbol = Symbol.for(
  "@t15i/webspecs/webidl/NamedPropertyDeleter",
);

export type NamedPropertyDeleter = Operation<[PropertyName], unknown>;

declare module "@webidl" {
  interface InterfaceMembers {
    [NamedPropertyDeleter]?: NamedPropertyDeleter;
  }
}
