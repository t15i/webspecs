import type { Type, TypeBase } from "@webidl";

export const UNSIGNED_LONG_TYPE_NAME = "unsigned long";

/** @see https://webidl.spec.whatwg.org/#idl-unsigned-long */
export interface UnsignedLongType extends TypeBase<number> {
  name: typeof UNSIGNED_LONG_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#idl-unsigned-long */
export function isUnsignedLongType(T: Type): T is UnsignedLongType {
  return T.name === UNSIGNED_LONG_TYPE_NAME;
}
