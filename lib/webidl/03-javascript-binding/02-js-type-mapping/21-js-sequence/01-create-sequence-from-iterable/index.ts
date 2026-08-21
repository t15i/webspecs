import { getIteratorFromMethod } from "@ecma";
import type { NativeType, Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#create-sequence-from-iterable */
export function createSequenceFromIterable<T extends Type>(
  T: T,
  iterable: unknown,
  method: CallableFunction,
): NativeType<T>[] {
  const iteratorRecord = getIteratorFromMethod(iterable, method);
  const sequence: NativeType<T>[] = [];

  while (true) {
    const next = Reflect.apply(
      iteratorRecord.nextMethod as CallableFunction,
      iteratorRecord.iterator,
      [],
    ) as IteratorResult<unknown>;

    if (next.done) {
      return sequence;
    }

    sequence.push(T(next.value));
  }
}
