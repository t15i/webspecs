import type { Type } from "@webidl";

export const USV_STRING_TYPE_NAME = "USVString";

/** @see https://webidl.spec.whatwg.org/#idl-USVString */
export interface USVStringType extends Type<string> {
  name: typeof USV_STRING_TYPE_NAME;
}

export function isUSVStringType(T: Type): T is USVStringType {
  return T.name === USV_STRING_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [USV_STRING_TYPE_NAME]: USVStringType;
  }
}
