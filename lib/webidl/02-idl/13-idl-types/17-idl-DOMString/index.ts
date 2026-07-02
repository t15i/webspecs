import type { Type } from "@webidl";

export const DOM_STRING_TYPE_NAME = "DOMString";

/** @see https://webidl.spec.whatwg.org/#idl-DOMString */
export interface DOMStringType extends Type<string> {
  name: typeof DOM_STRING_TYPE_NAME;
}

export function isDOMStringType(T: Type): T is DOMStringType {
  return T.name === DOM_STRING_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [DOM_STRING_TYPE_NAME]: DOMStringType;
  }
}
