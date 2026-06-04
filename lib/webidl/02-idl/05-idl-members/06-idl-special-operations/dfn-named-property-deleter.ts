import { type PropertyKey } from "@ecma";
import { type Operation } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-named-property-deleter */
export const NamedPropertyDeleter: unique symbol = Symbol.for(
  "@t15i/web-spec/webidl/NamedPropertyDeleter",
);

export type NamedPropertyDeleter = Operation<[PropertyKey], boolean>;

declare module "@webidl" {
  interface Interface {
    [NamedPropertyDeleter]?: NamedPropertyDeleter;
  }
}
