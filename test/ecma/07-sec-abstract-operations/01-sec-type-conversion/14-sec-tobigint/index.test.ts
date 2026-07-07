/**
 * @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tobigint
 *
 * ToBigInt runs ToPrimitive(argument, number) first, then: undefined, null, a
 * number and a symbol throw a TypeError; a boolean gives 1n or 0n; a bigint is
 * itself; a string parses (or throws a SyntaxError).
 */
import { describe, expect, test } from "vitest";
import { toBigInt } from "lib/ecma";

describe("toBigInt", () => {
  test.each([
    ["true", true, 1n],
    ["false", false, 0n],
    ["a digit string", "42", 42n],
    ["a negative string", "-7", -7n],
    ["an empty string", "", 0n],
    ["a bigint", 10n, 10n],
  ] as const)("toBigInt(%s) === %s", (_, input, expected) => {
    expect(toBigInt(input)).toBe(expected);
  });

  test("object whose primitive is a BigInt -> that bigint", () => {
    expect(toBigInt({ valueOf: () => 9n })).toBe(9n);
    expect(toBigInt({ [Symbol.toPrimitive]: () => 3n })).toBe(3n);
  });

  test("non-numeric string throws SyntaxError", () => {
    expect(() => toBigInt("abc")).toThrow(SyntaxError);
  });

  test.each([
    ["undefined", undefined],
    ["null", null],
    ["a number", 42],
    ["NaN", NaN],
    ["a symbol", Symbol("x")],
  ] as const)("throws a TypeError for %s", (_, input) => {
    expect(() => toBigInt(input)).toThrow(TypeError);
  });

  test("object whose primitive is a Number throws a TypeError", () => {
    // ToBigInt does ToPrimitive first; a Number primitive is a TypeError,
    // not a silent BigInt() coercion.
    expect(() => toBigInt({ valueOf: () => 5 })).toThrow(TypeError);
    expect(() => toBigInt({ [Symbol.toPrimitive]: () => 5 })).toThrow(
      TypeError,
    );
  });
});
