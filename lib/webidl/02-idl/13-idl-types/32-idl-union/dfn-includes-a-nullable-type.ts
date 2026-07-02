import { type Type, isAnnotatedType, isNullableType } from "@webidl";

import { isUnionType } from "./dfn-union-type";

/** @see https://webidl.spec.whatwg.org/#dfn-includes-a-nullable-type */
export function includesNullableType(T: Type): boolean {
  return (
    isNullableType(T) ||
    (isAnnotatedType(T) && isNullableType(T.innerType)) ||
    (isUnionType(T) && T.numberOfNullableMemberTypes === 1)
  );
}
