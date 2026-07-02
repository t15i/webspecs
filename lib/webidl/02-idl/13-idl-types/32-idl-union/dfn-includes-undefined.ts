import {
  isAnnotatedType,
  isNullableType,
  isUndefinedType,
  isUnionType,
  type Type,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-includes-undefined */
export function includesUndefined(T: Type): boolean {
  return (
    isUndefinedType(T) ||
    (isNullableType(T) && includesUndefined(T.innerType)) ||
    (isAnnotatedType(T) && includesUndefined(T.innerType)) ||
    (isUnionType(T) && T.memberTypes.some((MT) => includesUndefined(MT)))
  );
}
