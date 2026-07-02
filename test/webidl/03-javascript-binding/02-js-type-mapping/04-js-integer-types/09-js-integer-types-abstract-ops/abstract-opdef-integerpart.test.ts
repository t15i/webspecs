/**
 * @see https://webidl.spec.whatwg.org/#abstract-opdef-integerpart
 *
 * IntegerPart(n):
 *   1. Let r be floor(abs(n)).
 *   2. If n \< 0, then return -1 * r.
 *   3. Otherwise, return r.
 */
import { describe, expect, test } from "vitest";
import { integerPart } from "lib/webidl";

describe("integerPart", () => {
  test.each([
    [0, 0],
    [1, 1],
    [-1, -1],
    [1.5, 1],
    [-1.5, -1],
    [1.999, 1],
    [-1.999, -1],
    [2.0, 2],
    [-2.0, -2],
    [0.5, 0],
    [-0.5, 0],
    [1e10, 1e10],
    [-1e10, -1e10],
  ] as const)("integerPart(%s) === %s", (n, expected) => {
    expect(integerPart(n)).toBe(expected);
  });

  test("+0 -> +0", () => {
    expect(Object.is(integerPart(0), 0)).toBe(true);
  });

  test("-0 -> +0 (floor(abs(-0)) = 0, sign(-0) is non-negative)", () => {
    // The result of floor(abs(-0)) is +0; per algorithm step 2,
    // -0 < 0 is false, so the value flows through step 3 unchanged.
    expect(Object.is(integerPart(-0), 0)).toBe(true);
  });
});
