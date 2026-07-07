/**
 * @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tostring
 *
 * ToString stringifies undefined, null, booleans, numbers, strings and
 * bigints; it throws a TypeError for a Symbol; for an object it stringifies
 * ToPrimitive(argument, string).
 */
import { describe, expect, test } from "vitest";
import { toString } from "lib/ecma";

describe("toString", () => {
  test.each([
    ["undefined", undefined, "undefined"],
    ["null", null, "null"],
    ["true", true, "true"],
    ["false", false, "false"],
    ["a number", 3.14, "3.14"],
    ["+0", 0, "0"],
    ["-0", -0, "0"],
    ["NaN", NaN, "NaN"],
    ["Infinity", Infinity, "Infinity"],
    ["a string", "abc", "abc"],
    ["a bigint", 10n, "10"],
    ["a negative bigint", -7n, "-7"],
    ["an array", [1, 2, 3], "1,2,3"],
    ["a plain object", {}, "[object Object]"],
  ] as const)("ToString of %s", (_, input, expected) => {
    expect(toString(input)).toBe(expected);
  });

  test("uses ToPrimitive(string) for objects", () => {
    expect(toString({ toString: () => "custom" })).toBe("custom");
  });

  test("throws a TypeError for a Symbol (unlike String(), which does not)", () => {
    expect(() => toString(Symbol("x"))).toThrow(TypeError);
  });
});
