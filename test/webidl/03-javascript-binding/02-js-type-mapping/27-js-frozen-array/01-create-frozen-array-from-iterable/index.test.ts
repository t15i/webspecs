/**
 * @see https://webidl.spec.whatwg.org/#create-frozen-array-from-iterable
 *
 *   1. Let values be the result of creating a sequence of type
 *      sequence<T> from iterable and method.
 *   2. Return the result of creating a frozen array from values.
 */
import { describe, expect, test } from "vitest";
import { createFrozenArrayFromIterable } from "lib/webidl";

import { makeLongType } from "../../../../02-idl/13-idl-types/utils";

describe("createFrozenArrayFromIterable", () => {
  test("empty iterable -> empty frozen array", () => {
    const out = createFrozenArrayFromIterable(makeLongType(), []);
    expect(out).toEqual([]);
    expect(Object.isFrozen(out)).toBe(true);
  });

  test("converts each element via T and freezes the result", () => {
    const out = createFrozenArrayFromIterable(makeLongType(), ["1", 2.7, true]);
    expect(out).toEqual([1, 2, 1]);
    expect(Object.isFrozen(out)).toBe(true);
  });

  test("consumes a generator", () => {
    function* g(): Generator<unknown> {
      yield 5;
      yield "6";
    }
    const out = createFrozenArrayFromIterable(makeLongType(), g());
    expect(out).toEqual([5, 6]);
    expect(Object.isFrozen(out)).toBe(true);
  });
});
