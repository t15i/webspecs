import type { Type } from "@webidl";

export const ANY_TYPE_NAME = "any";

/** @see https://webidl.spec.whatwg.org/#idl-any */
export interface AnyType extends Type {
  name: typeof ANY_TYPE_NAME;
}

export function isAnyType(T: Type): T is AnyType {
  return T.name === ANY_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [ANY_TYPE_NAME]: AnyType;
  }
}
