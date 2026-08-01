import type { Type, TypeBase } from "@webidl";

export const DOUBLE_TYPE_NAME = "double";

/** @see https://webidl.spec.whatwg.org/#idl-double */
export interface DoubleType extends TypeBase<number> {
  name: typeof DOUBLE_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#idl-double */
export function isDoubleType(T: Type): T is DoubleType {
  return T.name === DOUBLE_TYPE_NAME;
}
