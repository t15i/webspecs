import { createSequenceFromIterable } from "@webidl";

export function Sequence<T>(
  T: (...args: unknown[]) => T,
): (raw: unknown) => T[];

export function Sequence<T>(T: (...args: unknown[]) => T, raw: unknown): T[];

export function Sequence<T>(T: (...args: unknown[]) => T, raw?: unknown) {
  if (arguments.length < 2) {
    return Sequence.bind(undefined, T);
  }

  if (!(typeof raw === "object") || raw === null) {
    throw TypeError("The provided value cannot be converted to a sequence");
  }

  if (!(Symbol.iterator in raw) || typeof raw[Symbol.iterator] !== "function") {
    throw TypeError("The provided value cannot be converted to a sequence");
  }
  const iterable = raw as { [Symbol.iterator](): Iterator<unknown> };

  return createSequenceFromIterable(T, iterable);
}
