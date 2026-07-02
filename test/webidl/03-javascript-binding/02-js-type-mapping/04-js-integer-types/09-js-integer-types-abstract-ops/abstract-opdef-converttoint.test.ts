/**
 * @see https://webidl.spec.whatwg.org/#abstract-opdef-converttoint
 *
 * Spec steps implemented by this library:
 *
 *   1-3. Compute lowerBound and upperBound from bitLength and signedness.
 *   4.   Let x be ? ToNumber(V).
 *   5.   If x is -0, then set x to +0.
 *   6.   If the conversion is to an IDL type associated with the
 *        [EnforceRange] extended attribute, then:
 *          - If x is NaN, +Infinity, or -Infinity, throw TypeError.
 *          - Set x to IntegerPart(x).
 *          - If x \< lowerBound or x \> upperBound, throw TypeError.
 *          - Return x.
 *   7.   If x is not NaN and the conversion is to an IDL type associated
 *        with the [Clamp] extended attribute, then:
 *          - Set x to min(max(x, lowerBound), upperBound).
 *          - Round x to the nearest integer (banker's rounding).
 *          - Return x.
 *   8.   If x is NaN, +0, +Infinity, or -Infinity, then return +0.
 *   9.   Set x to IntegerPart(x).
 *   10.  Set x to x modulo 2^bitLength.
 *   11.  If signedness is "signed" and x \>= 2^(bitLength - 1), then
 *        return x - 2^bitLength.
 *   12.  Otherwise, return x.
 */
import { describe, expect, test } from "vitest";
import { convertToInt, Clamp, EnforceRange, type Type } from "lib/webidl";

import {
  makeLongType,
  makeUnsignedLongType,
} from "../../../../02-idl/13-idl-types/utils";

describe("convertToInt - non-finite values", () => {
  test.each([
    ["NaN", NaN],
    ["+Infinity", Infinity],
    ["-Infinity", -Infinity],
  ] as const)("%s -> +0", (_, v) => {
    expect(convertToInt(v, 32, "signed")).toBe(0);
    expect(convertToInt(v, 32, "unsigned")).toBe(0);
  });
});

describe("convertToInt - within-range values", () => {
  test.each([
    [0, 32, "signed", 0],
    [1, 32, "signed", 1],
    [-1, 32, "signed", -1],
    [2147483647, 32, "signed", 2147483647],
    [-2147483648, 32, "signed", -2147483648],
    [0, 32, "unsigned", 0],
    [4294967295, 32, "unsigned", 4294967295],
  ] as const)("convertToInt(%s, %s, %s) === %s", (v, bits, sign, expected) => {
    expect(convertToInt(v, bits, sign)).toBe(expected);
  });
});

describe("convertToInt - modulo wrap (signed 32-bit)", () => {
  test("2^31 wraps to -2^31", () => {
    expect(convertToInt(2147483648, 32, "signed")).toBe(-2147483648);
  });
  test("2^31 + 1 wraps to -2^31 + 1", () => {
    expect(convertToInt(2147483649, 32, "signed")).toBe(-2147483647);
  });
  test("2^32 wraps to 0", () => {
    expect(convertToInt(4294967296, 32, "signed")).toBe(0);
  });
  test("-2^31 - 1 wraps to 2^31 - 1", () => {
    expect(convertToInt(-2147483649, 32, "signed")).toBe(2147483647);
  });
});

describe("convertToInt - modulo wrap (unsigned 32-bit)", () => {
  test("-1 wraps to 2^32 - 1", () => {
    expect(convertToInt(-1, 32, "unsigned")).toBe(4294967295);
  });
  test("2^32 wraps to 0", () => {
    expect(convertToInt(4294967296, 32, "unsigned")).toBe(0);
  });
  test("2^32 + 5 wraps to 5", () => {
    expect(convertToInt(4294967301, 32, "unsigned")).toBe(5);
  });
  test("-2147483649 wraps to 2147483647", () => {
    expect(convertToInt(-2147483649, 32, "unsigned")).toBe(2147483647);
  });
});

describe("convertToInt - truncation (IntegerPart) before modulo", () => {
  test.each([
    [1.7, 32, "signed", 1],
    [1.999, 32, "signed", 1],
    [-1.7, 32, "signed", -1],
    [-1.999, 32, "signed", -1],
    [-0.9, 32, "signed", 0],
    [0.5, 32, "unsigned", 0],
  ] as const)("convertToInt(%s, %s, %s) === %s", (v, bits, sign, expected) => {
    expect(convertToInt(v, bits, sign)).toBe(expected);
  });
});

describe("convertToInt - ToNumber-style coercion of V", () => {
  test("string of a number coerces", () => {
    expect(convertToInt("42", 32, "signed")).toBe(42);
  });
  test("empty string coerces to +0", () => {
    expect(convertToInt("", 32, "signed")).toBe(0);
  });
  test("whitespace coerces to +0", () => {
    expect(convertToInt("   ", 32, "signed")).toBe(0);
  });
  test("null coerces to +0", () => {
    expect(convertToInt(null, 32, "signed")).toBe(0);
  });
  test("true coerces to 1, false to 0", () => {
    expect(convertToInt(true, 32, "signed")).toBe(1);
    expect(convertToInt(false, 32, "signed")).toBe(0);
  });
  test("undefined -> NaN -> +0", () => {
    expect(convertToInt(undefined, 32, "signed")).toBe(0);
  });
  test("Symbol throws TypeError (ToNumber(Symbol) throws)", () => {
    expect(() => convertToInt(Symbol("x"), 32, "signed")).toThrow(TypeError);
  });
});

describe("convertToInt - bitLength variants", () => {
  test("8-bit unsigned wraps modulo 256", () => {
    expect(convertToInt(257, 8, "unsigned")).toBe(1);
    expect(convertToInt(-1, 8, "unsigned")).toBe(255);
  });
  test("16-bit signed wraps", () => {
    expect(convertToInt(32768, 16, "signed")).toBe(-32768);
    expect(convertToInt(-32769, 16, "signed")).toBe(32767);
  });
});

describe("convertToInt - [EnforceRange] (signed 32-bit)", () => {
  const T = makeLongType({ enforceRange: true });

  test.each([
    ["NaN", NaN],
    ["+Infinity", Infinity],
    ["-Infinity", -Infinity],
  ] as const)("%s throws TypeError", (_, v) => {
    expect(() => T(v)).toThrow(TypeError);
  });

  test("value above upperBound throws TypeError", () => {
    expect(() => T(2147483648)).toThrow(TypeError);
  });

  test("value below lowerBound throws TypeError", () => {
    expect(() => T(-2147483649)).toThrow(TypeError);
  });

  test("upperBound is accepted (2^31 - 1)", () => {
    expect(T(2147483647)).toBe(2147483647);
  });

  test("lowerBound is accepted (-2^31)", () => {
    expect(T(-2147483648)).toBe(-2147483648);
  });

  test("in-range float is truncated toward zero", () => {
    expect(T(1.9)).toBe(1);
    expect(T(-1.9)).toBe(-1);
  });

  test("IntegerPart is applied before range check (1.9 not rejected)", () => {
    expect(T(2147483647.9)).toBe(2147483647);
    expect(T(-2147483648.9)).toBe(-2147483648);
  });
});

describe("convertToInt - [EnforceRange] (unsigned 32-bit)", () => {
  const T = makeUnsignedLongType({ enforceRange: true });

  test("negative value throws TypeError", () => {
    expect(() => T(-1)).toThrow(TypeError);
  });

  test("value above 2^32 - 1 throws TypeError", () => {
    expect(() => T(4294967296)).toThrow(TypeError);
  });

  test("upperBound is accepted", () => {
    expect(T(4294967295)).toBe(4294967295);
  });

  test("zero is accepted", () => {
    expect(T(0)).toBe(0);
  });
});

describe("convertToInt - [Clamp] (signed 32-bit)", () => {
  const T = makeLongType({ clamp: true });

  test("NaN falls through to +0 (Clamp only applies when x is not NaN)", () => {
    expect(T(NaN)).toBe(0);
  });

  test("+Infinity clamps to upperBound", () => {
    expect(T(Infinity)).toBe(2147483647);
  });

  test("-Infinity clamps to lowerBound", () => {
    expect(T(-Infinity)).toBe(-2147483648);
  });

  test("value above upperBound clamps to upperBound", () => {
    expect(T(9999999999)).toBe(2147483647);
  });

  test("value below lowerBound clamps to lowerBound", () => {
    expect(T(-9999999999)).toBe(-2147483648);
  });

  test("in-range integer passes through", () => {
    expect(T(42)).toBe(42);
    expect(T(-42)).toBe(-42);
  });
});

describe("convertToInt - [Clamp] (unsigned 32-bit)", () => {
  const T = makeUnsignedLongType({ clamp: true });

  test("negative value clamps to 0", () => {
    expect(T(-1)).toBe(0);
    expect(T(-Infinity)).toBe(0);
  });

  test("value above 2^32 - 1 clamps to upperBound", () => {
    expect(T(9999999999)).toBe(4294967295);
    expect(T(Infinity)).toBe(4294967295);
  });
});

describe("convertToInt - [Clamp] half-to-even rounding", () => {
  const T = makeLongType({ clamp: true });

  test.each([
    [0.5, 0],
    [1.5, 2],
    [2.5, 2],
    [3.5, 4],
    [-0.5, 0],
    [-1.5, -2],
    [-2.5, -2],
    [-3.5, -4],
  ] as const)("clamp+round(%s) === %s", (v, expected) => {
    expect(T(v)).toBe(expected);
  });

  test("non-halfway values round to nearest", () => {
    expect(T(1.2)).toBe(1);
    expect(T(1.7)).toBe(2);
    expect(T(-1.2)).toBe(-1);
    expect(T(-1.7)).toBe(-2);
  });

  test("result is +0, not -0", () => {
    expect(Object.is(T(-0.5), 0)).toBe(true);
    expect(Object.is(T(-0.3), 0)).toBe(true);
  });
});

describe("convertToInt - bitLength 64 special bounds", () => {
  const make = (attrs: { [Clamp]?: null; [EnforceRange]?: null }): Type =>
    Object.assign(((v: unknown) => v) as Type, { extendedAttributes: attrs });

  test("[EnforceRange] signed 64-bit accepts up to 2^53 - 1", () => {
    const T = make({ [EnforceRange]: null });
    expect(convertToInt.call(T, 2 ** 53 - 1, 64, "signed")).toBe(2 ** 53 - 1);
    expect(convertToInt.call(T, -(2 ** 53) + 1, 64, "signed")).toBe(
      -(2 ** 53) + 1,
    );
  });

  test("[EnforceRange] signed 64-bit rejects 2^53", () => {
    const T = make({ [EnforceRange]: null });
    expect(() => convertToInt.call(T, 2 ** 53, 64, "signed")).toThrow(
      TypeError,
    );
  });

  test("[EnforceRange] unsigned 64-bit lowerBound is 0", () => {
    const T = make({ [EnforceRange]: null });
    expect(() => convertToInt.call(T, -1, 64, "unsigned")).toThrow(TypeError);
    expect(convertToInt.call(T, 0, 64, "unsigned")).toBe(0);
  });

  test("[Clamp] signed 64-bit clamps to 2^53 - 1 / -2^53 + 1", () => {
    const T = make({ [Clamp]: null });
    expect(convertToInt.call(T, Infinity, 64, "signed")).toBe(2 ** 53 - 1);
    expect(convertToInt.call(T, -Infinity, 64, "signed")).toBe(-(2 ** 53) + 1);
  });
});
