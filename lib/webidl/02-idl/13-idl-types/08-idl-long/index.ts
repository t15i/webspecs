import type { Type, TypeBase } from "@webidl";

export const LONG_TYPE_NAME = "long";

export const LONG_MIN = -2147483648;
export const LONG_MAX = 2147483647;

/** @see https://webidl.spec.whatwg.org/#idl-long */
export interface LongType extends TypeBase<number> {
  name: typeof LONG_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#idl-long */
export function isLongType(T: Type): T is LongType {
  return T.name === LONG_TYPE_NAME;
}
