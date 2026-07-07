/**
 * @see https://webidl.spec.whatwg.org/#js-frozen-array
 *
 *   1. Let values be the result of converting V to IDL type
 *      sequence<T>.
 *   2. Return the result of creating a frozen array from values.
 *
 * `createFrozenArray(values)` is the spec's "create a frozen array from
 * a sequence of values" - it converts values to a JS Array, then
 * performs ! SetIntegrityLevel(array, "frozen").
 */
import { describe, expect, test } from "vitest";
import { createFrozenArray } from "lib/webidl";

import {
  makeFrozenArrayType,
  makeLongType,
} from "../../../02-idl/13-idl-types/utils";

describe("createFrozenArray", () => {
  test("returns the same array after freezing", () => {
    const input = [1, 2, 3];
    const out = createFrozenArray(input);
    expect(out).toEqual([1, 2, 3]);
    expect(Object.isFrozen(out)).toBe(true);
  });

  test("freezing an empty array", () => {
    const out = createFrozenArray<number>([]);
    expect(out).toEqual([]);
    expect(Object.isFrozen(out)).toBe(true);
  });
});

describe("asFrozenArray", () => {
  const T = makeFrozenArrayType(makeLongType());

  test("array V -> frozen array converted via inner T", () => {
    const out = T([1, "2", 3.7]);
    expect(out).toEqual([1, 2, 3]);
    expect(Object.isFrozen(out)).toBe(true);
  });

  test("empty array V -> empty frozen array", () => {
    const out = T([]);
    expect(out).toEqual([]);
    expect(Object.isFrozen(out)).toBe(true);
  });

  test("generator V -> frozen array", () => {
    function* g(): Generator<unknown> {
      yield 1;
      yield 2;
    }
    const out = T(g());
    expect(out).toEqual([1, 2]);
    expect(Object.isFrozen(out)).toBe(true);
  });

  test.each([
    ["null", null],
    ["undefined", undefined],
    ["a number", 42],
    ["a non-iterable object", { a: 1 }],
  ] as const)("throws TypeError for %s", (_, value) => {
    expect(() => T(value)).toThrow(TypeError);
  });
});
