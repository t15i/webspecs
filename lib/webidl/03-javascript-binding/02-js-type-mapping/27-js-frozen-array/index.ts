import {
  asSequence,
  type FrozenArrayType,
  type SequenceType,
  type Type,
} from "@webidl";

export * from "./01-create-frozen-array-from-iterable";

/** @see https://webidl.spec.whatwg.org/#dfn-create-frozen-array */
export function createFrozenArray<T>(values: T[]): readonly T[] {
  return Object.freeze(values);
}

/** @see https://webidl.spec.whatwg.org/#js-frozen-array */
export function asFrozenArray<T>(
  this: FrozenArrayType<Type<T>>,
  v: unknown,
): readonly T[] {
  const values = asSequence.call(
    this as unknown as SequenceType<Type<T>>,
    v,
  ) as T[];
  return createFrozenArray(values);
}
