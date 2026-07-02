/**
 * @see https://webidl.spec.whatwg.org/#js-unsigned-long
 *
 *   1. Let x be ? ConvertToInt(V, 32, "unsigned").
 *   2. Return the IDL unsigned long value that represents the same
 *      numeric value as x.
 *
 * Range: [0, 4294967295].
 */
import { describe, expect, test } from "vitest";

import { makeUnsignedLongType } from "../../../../02-idl/13-idl-types/utils";

describe("asUnsignedLong (unsigned 32-bit)", () => {
  const T = makeUnsignedLongType();

  test.each([
    [0, 0],
    [1, 1],
    [4294967295, 4294967295], // 2^32 - 1
    [4294967296, 0], // 2^32 wraps
    [-1, 4294967295], // -1 wraps
    [-2147483648, 2147483648], // -2^31 wraps
    ["42", 42],
    [true, 1],
    [false, 0],
    [null, 0],
    [NaN, 0],
    [Infinity, 0],
    [-Infinity, 0],
    [3.7, 3],
    [-0.5, 0],
  ] as const)("asUnsignedLong(%s) === %s", (input, expected) => {
    expect(T(input)).toBe(expected);
  });

  test("Symbol throws TypeError", () => {
    expect(() => T(Symbol("x"))).toThrow(TypeError);
  });
});
