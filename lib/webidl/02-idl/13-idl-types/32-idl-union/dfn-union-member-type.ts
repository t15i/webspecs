import { isAnyType, type Type, type UnionType } from "@webidl";

declare module "@webidl" {
  interface UnionType<T extends Type = Type> {
    /** @see https://webidl.spec.whatwg.org/#dfn-union-member-type */
    memberTypes: T[];
  }
}

export function validateUnionMemberTypes(T: UnionType): void {
  if (T.memberTypes.some((T) => isAnyType(T))) {
    throw TypeError("The any type must not be used as a union member type.");
  }
}
