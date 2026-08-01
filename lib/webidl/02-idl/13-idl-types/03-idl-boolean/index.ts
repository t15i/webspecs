import type { Type, TypeBase } from "@webidl";

export const BOOLEAN_TYPE_NAME = "boolean";

/** @see https://webidl.spec.whatwg.org/#idl-boolean */
export interface BooleanType extends TypeBase<boolean> {
  name: typeof BOOLEAN_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#idl-boolean */
export function isBooleanType(T: Type): T is BooleanType {
  return T.name === BOOLEAN_TYPE_NAME;
}
