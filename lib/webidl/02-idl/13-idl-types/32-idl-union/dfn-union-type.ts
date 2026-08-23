import { type Type, type TypeBase } from "@webidl";

export const UNION_TYPE_NAME = "Union";

/** @see https://webidl.spec.whatwg.org/#idl-union */
export interface UnionType<Ts extends Type[] = Type[]> extends TypeBase<
  ReturnType<Ts[number]>
> {
  name: typeof UNION_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#idl-union */
export function isUnionType(T: Type): T is UnionType {
  return T.name === UNION_TYPE_NAME;
}
