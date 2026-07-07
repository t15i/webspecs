import { getMethod, isObject } from "@ecma";
import {
  createSequenceFromIterable,
  type SequenceType,
  type Type,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#js-sequence */
export function asSequence<T>(this: SequenceType<Type<T>>, v: unknown): T[] {
  if (!isObject(v)) {
    throw TypeError("The provided value cannot be converted to a sequence");
  }

  const method = getMethod(v, Symbol.iterator);
  if (method === undefined) {
    throw TypeError("The provided value cannot be converted to a sequence");
  }

  return createSequenceFromIterable(this.T, v as Iterable<unknown>);
}
