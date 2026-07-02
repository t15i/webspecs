/**
 * @see https://webidl.spec.whatwg.org/#js-bigint
 *
 *   1. Let x be ? ToBigInt(V).
 *   2. Return the IDL bigint value that represents the same numeric
 *      value as x.
 *
 * ToBigInt per ECMA-262:
 *   - undefined / null / NaN / numbers / symbols -\> TypeError
 *   - boolean -\> 1n / 0n
 *   - string -\> parsed as BigInt or TypeError
 *   - bigint -\> identity
 */
import { describe, expect, test } from "vitest";

import { makeBigIntType } from "../../../02-idl/13-idl-types/utils";

describe("asBigInt", () => {
  const T = makeBigIntType();

  test("bigint identity", () => {
    expect(T(0n)).toBe(0n);
    expect(T(42n)).toBe(42n);
    expect(T(-1n)).toBe(-1n);
  });

  test("boolean coerces (true -> 1n, false -> 0n)", () => {
    expect(T(true)).toBe(1n);
    expect(T(false)).toBe(0n);
  });

  test("string of digits parses to bigint", () => {
    expect(T("42")).toBe(42n);
    expect(T("-7")).toBe(-7n);
    expect(T("0")).toBe(0n);
  });

  test("empty string parses to 0n", () => {
    expect(T("")).toBe(0n);
  });

  test("non-numeric string throws SyntaxError (ToBigInt path)", () => {
    expect(() => T("abc")).toThrow(SyntaxError);
  });

  test.each([
    ["undefined", undefined],
    ["null", null],
    ["a number", 42],
    ["NaN", NaN],
    ["a symbol", Symbol("x")],
  ] as const)("throws TypeError for %s", (_, value) => {
    expect(() => T(value)).toThrow(TypeError);
  });

  test("object with valueOf returning bigint", () => {
    expect(T({ valueOf: (): bigint => 9n })).toBe(9n);
  });
});
