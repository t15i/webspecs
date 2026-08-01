import type { NativeType, Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#create-sequence-from-iterable */
export function createSequenceFromIterable<T extends Type>(
  T: T,
  iterable: Iterable<unknown>,
): NativeType<T>[] {
  const sequence: NativeType<T>[] = [];
  const iterator = iterable[Symbol.iterator]();

  while (true) {
    const next = iterator.next();

    if (next.done) {
      return sequence;
    }

    sequence.push(T(next.value));
  }
}
