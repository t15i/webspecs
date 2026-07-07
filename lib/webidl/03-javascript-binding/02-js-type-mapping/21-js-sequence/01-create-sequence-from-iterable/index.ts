import type { Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#create-sequence-from-iterable */
export function createSequenceFromIterable<T>(
  T: Type<T>,
  iterable: Iterable<unknown>,
): T[] {
  const sequence: T[] = [];
  const iterator = iterable[Symbol.iterator]();

  while (true) {
    const next = iterator.next();

    if (next.done) {
      return sequence;
    }

    sequence.push(T(next.value));
  }
}
