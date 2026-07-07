import type { Type } from "@webidl";

export const NULLABLE_TYPE_NAME = "Nullable";

/** @see https://webidl.spec.whatwg.org/#dfn-nullable-type */
export interface NullableType<
  T extends Type = Type,
> extends Type<ReturnType<T> | null> {
  name: typeof NULLABLE_TYPE_NAME;
}

export function isNullableType(T: Type): T is NullableType {
  return T.name === NULLABLE_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [NULLABLE_TYPE_NAME]: NullableType;
  }
}
