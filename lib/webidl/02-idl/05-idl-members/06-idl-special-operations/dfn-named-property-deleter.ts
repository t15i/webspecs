import type { NamedPropertyDeleterOperation } from "./02-idl-named-properties";

/** @see https://webidl.spec.whatwg.org/#dfn-named-property-deleter */
export const NamedPropertyDeleter: unique symbol = Symbol(
  "NamedPropertyDeleter",
);

declare module "@webidl" {
  interface InterfaceMembers {
    [NamedPropertyDeleter]?: NamedPropertyDeleterOperation;
  }
}
