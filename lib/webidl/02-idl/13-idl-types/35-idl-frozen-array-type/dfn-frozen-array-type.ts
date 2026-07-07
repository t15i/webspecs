import type { Type } from "@webidl";

export const FROZEN_ARRAY_TYPE_NAME = "FrozenArray";

/** @see https://webidl.spec.whatwg.org/#dfn-frozen-array-type */
export interface FrozenArrayType<T extends Type = Type> extends Type<
  readonly ReturnType<T>[]
> {
  name: typeof FROZEN_ARRAY_TYPE_NAME;
  T: T;
}

export function isFrozenArrayType(T: Type): T is FrozenArrayType {
  return T.name === FROZEN_ARRAY_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [FROZEN_ARRAY_TYPE_NAME]: FrozenArrayType;
  }
}
