import type { Type } from "@webidl";

/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflecturl */
export const ReflectURL: unique symbol = Symbol("ReflectURL");

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Attribute<T extends Type = Type> {
    [ReflectURL]?: string | null;
  }
}
