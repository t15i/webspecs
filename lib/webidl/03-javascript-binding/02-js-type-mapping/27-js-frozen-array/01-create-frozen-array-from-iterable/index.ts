import {
  createFrozenArray,
  createSequenceFromIterable,
  type Type,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#create-frozen-array-from-iterable */
export function createFrozenArrayFromIterable<T>(
  T: Type<T>,
  iterable: Iterable<unknown>,
): readonly T[] {
  const values = createSequenceFromIterable(T, iterable);
  return createFrozenArray(values);
}
