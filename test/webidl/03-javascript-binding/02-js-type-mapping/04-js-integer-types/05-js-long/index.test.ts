/**
 * @see https://webidl.spec.whatwg.org/#js-long
 *
 *   1. Let x be ? ConvertToInt(V, 32, "signed").
 *   2. Return the IDL long value that represents the same numeric value
 *      as x.
 *
 * Range: [-2147483648, 2147483647].
 */
import { describe, expect, test } from "vitest";

import { makeLongType } from "../../../../02-idl/13-idl-types/utils";

describe("asLong (signed 32-bit)", () => {
  const T = makeLongType();

  test.each([
    [0, 0],
    [1, 1],
    [-1, -1],
    [2147483647, 2147483647], // 2^31 - 1
    [-2147483648, -2147483648], // -2^31
    [2147483648, -2147483648], // 2^31 wraps
    [4294967296, 0], // 2^32 wraps
    [-2147483649, 2147483647], // -2^31 - 1 wraps
    ["42", 42],
    [true, 1],
    [false, 0],
    [null, 0],
    [NaN, 0],
    [Infinity, 0],
    [-Infinity, 0],
    [3.7, 3],
    [-3.7, -3],
  ] as const)("asLong(%s) === %s", (input, expected) => {
    expect(T(input)).toBe(expected);
  });

  test("Symbol throws TypeError", () => {
    expect(() => T(Symbol("x"))).toThrow(TypeError);
  });
});
