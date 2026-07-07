/**
 * @see https://webidl.spec.whatwg.org/#js-USVString
 *
 *   1. Let string be the result of converting V to a DOMString.
 *   2. Return the USVString value that is the result of converting
 *      string to a sequence of scalar values.
 *
 * Converting to scalar values replaces each unpaired surrogate with
 * U+FFFD REPLACEMENT CHARACTER.
 */
import { describe, expect, test } from "vitest";

import { makeUSVStringType } from "../../../02-idl/13-idl-types/utils";

describe("asUSVString - no extended attributes", () => {
  const T = makeUSVStringType();

  test.each([
    ["", ""],
    ["abc", "abc"],
    [42, "42"],
    [true, "true"],
    [null, "null"], // null without [LegacyNullToEmptyString] -> "null", scalar form is "null"
    [undefined, "undefined"],
  ] as const)("ToString(%s) -> %s", (input, expected) => {
    expect(T(input)).toBe(expected);
  });

  test("preserves paired surrogates (a valid astral character)", () => {
    // U+1F600 GRINNING FACE encoded as "😀".
    const grin = "😀";
    expect(T(grin)).toBe(grin);
  });

  test("replaces unpaired high surrogate with U+FFFD", () => {
    const lonelyHigh = "\uD83D"; // unpaired high surrogate
    expect(T(lonelyHigh)).toBe("�");
  });

  test("replaces unpaired low surrogate with U+FFFD", () => {
    const lonelyLow = "\uDE00"; // unpaired low surrogate
    expect(T(lonelyLow)).toBe("�");
  });

  test("Symbol throws TypeError", () => {
    expect(() => T(Symbol("x"))).toThrow(TypeError);
  });
});

describe("asUSVString - [LegacyNullToEmptyString]", () => {
  const T = makeUSVStringType({ legacyNullToEmptyString: true });

  test("null -> empty string when annotated", () => {
    expect(T(null)).toBe("");
  });

  test("undefined unaffected (annotation only triggers on null)", () => {
    expect(T(undefined)).toBe("undefined");
  });

  test("scalar conversion still applies to non-null inputs", () => {
    expect(T("\uD83D")).toBe("�");
  });
});
