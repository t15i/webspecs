import type { Type } from "@webidl";

/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflected-idl-attribute */
export interface ReflectedIDLAttribute {
  readonly name: string;
  readonly T: Type;
}
