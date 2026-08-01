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
import { asNumericOrBigint } from "lib/webidl";

import {
  makeBigIntType,
  makeDoubleType,
  makeLongType,
} from "../../../02-idl/13-idl-types/utils";

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

/**
 * "converted to a numeric type or bigint"
 * @see https://webidl.spec.whatwg.org/#js-to-bigint-or-numeric
 *
 *   1. Let x be ToNumeric(V).
 *   2. If x is a BigInt, return that bigint value.
 *   3. Assert: x is a Number.
 *   4. Return the result of converting x to the numeric type.
 *
 * The branch is decided by ToNumeric(V) - the *coerced* value - not the raw V.
 */
describe("asNumericOrBigint", () => {
  const long = makeLongType();
  const double = makeDoubleType();

  test("V is a BigInt -> that bigint (not converted to the numeric type)", () => {
    expect(asNumericOrBigint(long, 5n)).toBe(5n);
    expect(asNumericOrBigint(long, 0n)).toBe(0n);
    expect(asNumericOrBigint(long, -7n)).toBe(-7n);
  });

  test("V is a BigInt out of the numeric type's range -> returned unchanged", () => {
    // Step 2 returns the bigint as-is; no clamping/truncation to the numeric type.
    expect(asNumericOrBigint(long, 12345678901234567890n)).toBe(
      12345678901234567890n,
    );
  });

  test("V is a Number -> converted to the numeric type", () => {
    expect(asNumericOrBigint(long, 7)).toBe(7);
    expect(asNumericOrBigint(double, 3.5)).toBe(3.5);
  });

  test("V is a Number, numeric type semantics apply (long truncates)", () => {
    expect(asNumericOrBigint(long, 3.7)).toBe(3);
    expect(asNumericOrBigint(long, -3.7)).toBe(-3);
  });

  test("V is a numeric string -> ToNumeric is a Number -> numeric type", () => {
    expect(asNumericOrBigint(long, "42")).toBe(42);
    expect(asNumericOrBigint(double, "3.5")).toBe(3.5);
  });

  test("V is a Boolean -> ToNumeric is a Number -> numeric type", () => {
    expect(asNumericOrBigint(long, true)).toBe(1);
    expect(asNumericOrBigint(long, false)).toBe(0);
  });

  test("V is an object whose primitive (Symbol.toPrimitive) is a BigInt -> bigint", () => {
    const v = { [Symbol.toPrimitive]: (): bigint => 10n };
    expect(asNumericOrBigint(long, v)).toBe(10n);
  });

  test("V is an object whose primitive (valueOf) is a BigInt -> bigint", () => {
    const v = { valueOf: (): bigint => 99n };
    expect(asNumericOrBigint(long, v)).toBe(99n);
  });

  test("V is an object whose primitive is a Number -> numeric type", () => {
    const v = { valueOf: (): number => 12 };
    expect(asNumericOrBigint(long, v)).toBe(12);
  });
});
