/**
 * @see https://webidl.spec.whatwg.org/#js-double
 *
 *   1. Let x be ? ToNumber(V).
 *   2. If x is NaN, +Infinity, or -Infinity, then throw a TypeError.
 *   3. Return the IDL double value that represents the same numeric
 *      value as x.
 */
import { describe, expect, test } from "vitest";

import { makeDoubleType } from "../../../02-idl/13-idl-types/utils";

describe("asDouble", () => {
  const T = makeDoubleType();

  test.each([
    [0, 0],
    [-0, -0],
    [1, 1],
    [-1, -1],
    [1.5, 1.5],
    [-1.5, -1.5],
    [Number.MAX_VALUE, Number.MAX_VALUE],
    [-Number.MAX_VALUE, -Number.MAX_VALUE],
    [Number.MIN_VALUE, Number.MIN_VALUE],
    ["42", 42],
    ["3.14", 3.14],
    [true, 1],
    [false, 0],
    [null, 0],
    [[], 0], // [] -> "" -> 0
    [["5"], 5], // ["5"] -> "5" -> 5
  ] as const)("asDouble(%s) === %s", (input, expected) => {
    expect(T(input)).toBe(expected);
  });

  test("preserves -0 distinct from +0", () => {
    expect(Object.is(T(-0), -0)).toBe(true);
  });

  test.each([
    ["NaN", NaN],
    ["+Infinity", Infinity],
    ["-Infinity", -Infinity],
    ["undefined -> NaN", undefined],
  ] as const)("throws TypeError for %s", (_, value) => {
    expect(() => T(value)).toThrow(TypeError);
  });

  test("throws TypeError for non-numeric strings", () => {
    expect(() => T("abc")).toThrow(TypeError);
  });

  test("throws TypeError for Symbol (ToNumber(Symbol) throws)", () => {
    expect(() => T(Symbol("x"))).toThrow(TypeError);
  });

  test("throws TypeError for an object that has no numeric coercion", () => {
    expect(() => T({})).toThrow(TypeError);
  });

  test("uses valueOf when coercing an object", () => {
    expect(T({ valueOf: () => 7.5 })).toBe(7.5);
  });
});
