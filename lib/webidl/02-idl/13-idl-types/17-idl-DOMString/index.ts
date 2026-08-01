import type { Type, TypeBase } from "@webidl";

export const DOM_STRING_TYPE_NAME = "DOMString";

/** @see https://webidl.spec.whatwg.org/#idl-DOMString */
export interface DOMStringType extends TypeBase<string> {
  name: typeof DOM_STRING_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#idl-DOMString */
export function isDOMStringType(T: Type): T is DOMStringType {
  return T.name === DOM_STRING_TYPE_NAME;
}
