/**
 * @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-touint32
 *
 * ToUint32 maps to the unsigned range [0, 2^32 - 1]:
 *   number = ToNumber(argument); NaN, +0, -0, +Inf, -Inf all give +0;
 *   int = truncate(number); return int modulo 2^32 (unsigned).
 */
import { describe, expect, test } from "vitest";
import { toUint32 } from "lib/ecma";

describe("toUint32 (unsigned 32-bit)", () => {
  test.each([
    [0, 0],
    [1, 1],
    [4294967295, 4294967295], // 2^32 - 1
    [4294967296, 0], // 2^32 wraps to 0
    [4294967301, 5], // 2^32 + 5 wraps to 5
    [-1, 4294967295], // -1 wraps to 2^32 - 1
    [2147483648, 2147483648], // 2^31 stays positive (would be negative if signed)
    [3000000000, 3000000000], // above 2^31 stays unsigned
    [-2147483648, 2147483648], // -2^31 wraps
    [3.7, 3], // truncation toward zero
    [-3.7, 4294967293], // truncate(-3.7) = -3 -> 2^32 - 3
    ["42", 42],
    [true, 1],
    [null, 0],
    [NaN, 0],
    [Infinity, 0],
    [-Infinity, 0],
    [undefined, 0],
  ] as const)("toUint32(%s) === %s", (input, expected) => {
    expect(toUint32(input)).toBe(expected);
  });
});
