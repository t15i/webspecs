import {
  isAnnotatedType,
  isNullableType,
  type Type,
  type TypeMap,
  isDistinguishable,
} from "@webidl";
import { isUnionType, type UnionType } from "./dfn-union-type";

declare module "@webidl" {
  interface UnionType<T extends Type = Type> {
    /** @see https://webidl.spec.whatwg.org/#dfn-flattened-union-member-types */
    flattenedMemberTypes: FlattenedMemberTypes<T>;
  }
}

export interface FlattenedMemberTypes<
  T extends Type = Type,
> extends ReadonlyArray<T> {
  has(name: string): boolean;
  get<K extends keyof TypeMap>(name: K): TypeMap[K];
}

export function getFlattenedMemberTypes(T: UnionType): Type[] {
  const s: Type[] = [];
  for (let U of T.memberTypes as Type[]) {
    if (isAnnotatedType(U)) U = U.innerType;
    if (isNullableType(U)) U = U.innerType;
    if (isUnionType(U)) {
      s.push(...U.flattenedMemberTypes);
    } else {
      s.push(U);
    }
  }
  return s;
}

export function validateFlattenedMemberTypes(T: UnionType): void {
  for (let i = 0; i < T.flattenedMemberTypes.length; ++i) {
    for (let j = i + 1; j < T.flattenedMemberTypes.length; ++j) {
      if (
        !isDistinguishable(
          T.flattenedMemberTypes[i]!,
          T.flattenedMemberTypes[j]!,
        )
      ) {
        throw TypeError(
          "Each pair of flattened member types in a union type, T and U, must be distinguishable.",
        );
      }
    }
  }
}
