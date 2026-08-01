import type { Type, TypeBase } from "@webidl";

export const BYTE_STRING_TYPE_NAME = "ByteString";

/** @see https://webidl.spec.whatwg.org/#idl-ByteString */
export interface ByteStringType extends TypeBase<string> {
  name: typeof BYTE_STRING_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#idl-ByteString */
export function isByteStringType(T: Type): T is ByteStringType {
  return T.name === BYTE_STRING_TYPE_NAME;
}
