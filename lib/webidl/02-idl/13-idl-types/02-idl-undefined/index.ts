import type { Type, TypeBase } from "@webidl";

export const UNDEFINED_TYPE_NAME = "undefined";

/** @see https://webidl.spec.whatwg.org/#idl-undefined */
export interface UndefinedType extends TypeBase<undefined> {
  name: typeof UNDEFINED_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#idl-undefined */
export function isUndefinedType(T: Type): T is UndefinedType {
  return T.name === UNDEFINED_TYPE_NAME;
}
