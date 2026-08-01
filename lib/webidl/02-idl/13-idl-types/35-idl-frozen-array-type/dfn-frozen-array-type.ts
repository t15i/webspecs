import type { Type, TypeBase } from "@webidl";

export const FROZEN_ARRAY_TYPE_NAME = "FrozenArray";

/** @see https://webidl.spec.whatwg.org/#dfn-frozen-array-type */
export interface FrozenArrayType<T extends Type = Type> extends TypeBase<
  readonly ReturnType<T>[]
> {
  name: typeof FROZEN_ARRAY_TYPE_NAME;
  T: T;
}

/** @see https://webidl.spec.whatwg.org/#dfn-frozen-array-type */
export function isFrozenArrayType(T: Type): T is FrozenArrayType {
  return T.name === FROZEN_ARRAY_TYPE_NAME;
}
