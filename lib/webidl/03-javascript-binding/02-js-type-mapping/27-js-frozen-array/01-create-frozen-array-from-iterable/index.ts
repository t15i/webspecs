import {
  createFrozenArray,
  createSequenceFromIterable,
  type NativeType,
  type Type,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#create-frozen-array-from-iterable */
export function createFrozenArrayFromIterable<T extends Type>(
  T: T,
  iterable: Iterable<unknown>,
): readonly NativeType<T>[] {
  const values = createSequenceFromIterable(T, iterable);
  return createFrozenArray(values);
}
