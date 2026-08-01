import {
  asSequence,
  type FrozenArrayType,
  type NativeType,
  type SequenceType,
  type Type,
} from "@webidl";

export * from "./01-create-frozen-array-from-iterable";

/** @see https://webidl.spec.whatwg.org/#dfn-create-frozen-array */
export function createFrozenArray<T>(values: T[]): readonly T[] {
  return Object.freeze(values);
}

/** @see https://webidl.spec.whatwg.org/#js-frozen-array */
export function asFrozenArray<T extends Type>(
  this: FrozenArrayType<T>,
  v: unknown,
): readonly NativeType<T>[] {
  const asSequenceT = asSequence<T>;

  const values = asSequenceT.call(this as unknown as SequenceType<T>, v);
  return createFrozenArray(values);
}
