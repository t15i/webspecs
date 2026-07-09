import type { Type } from "@webidl";

/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectrange */
export const ReflectRange: unique symbol = Symbol("ReflectRange");

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Attribute<T extends Type = Type> {
    [ReflectRange]?: [number, number];
  }
}
