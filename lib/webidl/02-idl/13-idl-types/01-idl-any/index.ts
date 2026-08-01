import type { Type, TypeBase } from "@webidl";

export const ANY_TYPE_NAME = "any";

/** @see https://webidl.spec.whatwg.org/#idl-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AnyType extends TypeBase<any> {
  name: typeof ANY_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#idl-any */
export function isAnyType(T: Type): T is AnyType {
  return T.name === ANY_TYPE_NAME;
}
