import { type Type } from "@webidl";

export const UNION_TYPE_NAME = "Union";

/** @see https://webidl.spec.whatwg.org/#idl-union */
export interface UnionType<T extends Type = Type> extends Type<ReturnType<T>> {
  name: typeof UNION_TYPE_NAME;
}

export function isUnionType(T: Type): T is UnionType {
  return T.name === UNION_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [UNION_TYPE_NAME]: UnionType;
  }
}
