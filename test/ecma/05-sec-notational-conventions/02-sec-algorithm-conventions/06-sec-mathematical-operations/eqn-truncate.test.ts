/**
 * @see https://tc39.es/ecma262/#eqn-truncate
 *
 * truncate(x) removes the fractional part of x by rounding toward zero. As a
 * mathematical operation it is defined only for finite reals and never yields
 * -0 (the result is a mathematical integer).
 */
import { describe, expect, test } from "vitest";
import { truncate } from "lib/ecma";

describe("truncate", () => {
  test.each([
    [3.7, 3],
    [3.999, 3],
    [-3.7, -3],
    [-3.999, -3],
    [0.5, 0],
    [5, 5],
    [-5, -5],
  ] as const)("truncate(%s) === %s", (input, expected) => {
    expect(truncate(input)).toBe(expected);
  });

  test("a truncated result is +0, never -0", () => {
    expect(Object.is(truncate(-0.5), 0)).toBe(true);
    expect(Object.is(truncate(-0.5), -0)).toBe(false);
    expect(Object.is(truncate(-0), 0)).toBe(true);
  });

  test.each([
    ["+Infinity", Infinity],
    ["-Infinity", -Infinity],
    ["NaN", NaN],
  ] as const)("throws a TypeError for %s (not a finite real)", (_, input) => {
    expect(() => truncate(input)).toThrow(TypeError);
  });
});
