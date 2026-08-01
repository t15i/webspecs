import type { Type, TypeBase } from "@webidl";

export const NULLABLE_TYPE_NAME = "Nullable";

/** @see https://webidl.spec.whatwg.org/#dfn-nullable-type */
export interface NullableType<
  T extends Type = Type,
> extends TypeBase<ReturnType<T> | null> {
  name: typeof NULLABLE_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#dfn-nullable-type */
export function isNullableType(T: Type): T is NullableType {
  return T.name === NULLABLE_TYPE_NAME;
}
