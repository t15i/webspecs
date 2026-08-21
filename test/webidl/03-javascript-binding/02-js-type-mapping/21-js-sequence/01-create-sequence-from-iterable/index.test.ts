/**
 * @see https://webidl.spec.whatwg.org/#create-sequence-from-iterable
 *
 * To create an IDL value of type sequence<T> given an iterable and an
 * iterator getter method:
 *   1. Let iteratorRecord be ? GetIteratorFromMethod(iterable, method).
 *   2. Initialize i to be 0.
 *   3. Repeat:
 *      1. Let next be ? IteratorStepValue(iteratorRecord).
 *      2. If next is done, then return an IDL sequence value of
 *         length i.
 *      3. Initialize S[i] to the result of converting next to an IDL
 *         value of type T.
 *      4. Set i to i + 1.
 *
 * The method is the caller's to fetch — every one of them has already done so
 * to decide it had an iterable at all — and is passed in rather than looked up
 * again, so that a property with a getter is read the once.
 */
import { describe, expect, test } from "vitest";
import { createSequenceFromIterable } from "lib/webidl";

import {
  makeDOMStringType,
  makeLongType,
} from "../../../../02-idl/13-idl-types/utils";

/** What the caller's GetMethod(V, %Symbol.iterator%) would have returned. */
function iteratorMethod(iterable: Iterable<unknown>): CallableFunction {
  return iterable[Symbol.iterator];
}

describe("createSequenceFromIterable", () => {
  test("empty iterable -> empty sequence", () => {
    const iterable: unknown[] = [];

    expect(
      createSequenceFromIterable(
        makeLongType(),
        iterable,
        iteratorMethod(iterable),
      ),
    ).toEqual([]);
  });

  test("array iterable converts each element via T", () => {
    const iterable = [1, "2", true, 3.7];

    expect(
      createSequenceFromIterable(
        makeLongType(),
        iterable,
        iteratorMethod(iterable),
      ),
    ).toEqual([1, 2, 1, 3]);
  });

  test("generator iterable is consumed once", () => {
    function* gen(): Generator<unknown> {
      yield 1;
      yield "2";
      yield 3.7;
    }
    const iterable = gen();

    expect(
      createSequenceFromIterable(
        makeLongType(),
        iterable,
        iteratorMethod(iterable),
      ),
    ).toEqual([1, 2, 3]);
  });

  test("each element is converted to the IDL element type", () => {
    const iterable = [1, true, null];

    expect(
      createSequenceFromIterable(
        makeDOMStringType(),
        iterable,
        iteratorMethod(iterable),
      ),
    ).toEqual(["1", "true", "null"]);
  });

  test("propagates errors thrown by the inner conversion", () => {
    const iterable = [Symbol("x")];

    expect(() =>
      createSequenceFromIterable(
        makeDOMStringType(),
        iterable,
        iteratorMethod(iterable),
      ),
    ).toThrow(TypeError);
  });

  test("throws when the iterator's next is not a method", () => {
    expect(() =>
      createSequenceFromIterable(makeLongType(), {}, () => ({ next: 1 })),
    ).toThrow(TypeError);
  });

  test("takes the iterator from the method it is given", () => {
    // The property is read once, by whoever fetched the method; nothing here
    // goes back for it.
    let reads = 0;
    const iterable = {
      get [Symbol.iterator]() {
        reads += 1;
        return function* () {
          yield "1";
          yield "2";
        };
      },
    };
    const method = iterable[Symbol.iterator];

    expect(
      createSequenceFromIterable(makeLongType(), iterable, method),
    ).toEqual([1, 2]);
    expect(reads).toBe(1);
  });
});
