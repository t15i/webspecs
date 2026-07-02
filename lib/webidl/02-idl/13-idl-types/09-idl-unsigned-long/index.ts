import type { Type } from "@webidl";

export const UNSIGNED_LONG_TYPE_NAME = "unsigned long";

/** @see https://webidl.spec.whatwg.org/#idl-unsigned-long */
export interface UnsignedLongType extends Type<number> {
  name: typeof UNSIGNED_LONG_TYPE_NAME;
}

export function isUnsignedLongType(T: Type): T is UnsignedLongType {
  return T.name === UNSIGNED_LONG_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [UNSIGNED_LONG_TYPE_NAME]: UnsignedLongType;
  }
}
