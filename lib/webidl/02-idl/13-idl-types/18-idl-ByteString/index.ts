import type { Type } from "@webidl";

export const BYTE_STRING_TYPE_NAME = "ByteString";

/** @see https://webidl.spec.whatwg.org/#idl-ByteString */
export interface ByteStringType extends Type<string> {
  name: typeof BYTE_STRING_TYPE_NAME;
}

export function isByteStringType(T: Type): T is ByteStringType {
  return T.name === BYTE_STRING_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [BYTE_STRING_TYPE_NAME]: ByteStringType;
  }
}
