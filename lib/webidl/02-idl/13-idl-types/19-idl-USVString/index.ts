import type { Type, TypeBase } from "@webidl";

export const USV_STRING_TYPE_NAME = "USVString";

/** @see https://webidl.spec.whatwg.org/#idl-USVString */
export interface USVStringType extends TypeBase<string> {
  name: typeof USV_STRING_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#idl-USVString */
export function isUSVStringType(T: Type): T is USVStringType {
  return T.name === USV_STRING_TYPE_NAME;
}
