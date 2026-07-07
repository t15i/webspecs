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
 */
import { describe, expect, test } from "vitest";
import { createSequenceFromIterable } from "lib/webidl";

import {
  makeDOMStringType,
  makeLongType,
} from "../../../../02-idl/13-idl-types/utils";

describe("createSequenceFromIterable", () => {
  test("empty iterable -> empty sequence", () => {
    expect(createSequenceFromIterable(makeLongType(), [])).toEqual([]);
  });

  test("array iterable converts each element via T", () => {
    expect(
      createSequenceFromIterable(makeLongType(), [1, "2", true, 3.7]),
    ).toEqual([1, 2, 1, 3]);
  });

  test("generator iterable is consumed once", () => {
    function* gen(): Generator<unknown> {
      yield 1;
      yield "2";
      yield 3.7;
    }
    expect(createSequenceFromIterable(makeLongType(), gen())).toEqual([
      1, 2, 3,
    ]);
  });

  test("each element is converted to the IDL element type", () => {
    expect(
      createSequenceFromIterable(makeDOMStringType(), [1, true, null]),
    ).toEqual(["1", "true", "null"]);
  });

  test("propagates errors thrown by the inner conversion", () => {
    expect(() =>
      createSequenceFromIterable(makeDOMStringType(), [Symbol("x")]),
    ).toThrow(TypeError);
  });
});
