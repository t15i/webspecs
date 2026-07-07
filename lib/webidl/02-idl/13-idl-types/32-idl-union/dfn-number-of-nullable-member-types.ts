import { DICTIONARY_TYPE_NAME } from "../24-idl-dictionary";
import { isNullableType } from "../27-idl-nullable-type";
import { isUnionType, type UnionType } from "./dfn-union-type";

declare module "@webidl" {
  interface UnionType {
    /** @see https://webidl.spec.whatwg.org/#dfn-number-of-nullable-member-types */
    numberOfNullableMemberTypes: number;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-number-of-nullable-member-types */
export function getNumberOfNullableMemberTypes(T: UnionType): number {
  let n = 0;
  for (let U of T.memberTypes) {
    if (isNullableType(U)) {
      n = n + 1;
      U = U.innerType;
    }
    if (isUnionType(U)) {
      const m = getNumberOfNullableMemberTypes(U);
      n = n + m;
    }
  }
  return n;
}

export function validateNumberOfNullableMemberTypes(T: UnionType): void {
  if (
    T.numberOfNullableMemberTypes !== 0 &&
    T.numberOfNullableMemberTypes !== 1
  ) {
    throw TypeError(
      "The number of nullable member types of a union type must be 0 or 1",
    );
  }

  if (
    T.numberOfNullableMemberTypes === 1 &&
    T.flattenedMemberTypes.has(DICTIONARY_TYPE_NAME)
  ) {
    throw TypeError(
      "If the number of nullable member types is 1 then the union type must not have a dictionary type in its flattened member types",
    );
  }
}
