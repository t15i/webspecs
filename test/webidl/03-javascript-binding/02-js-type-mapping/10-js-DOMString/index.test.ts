/**
 * @see https://webidl.spec.whatwg.org/#js-DOMString
 *
 *   1. If V is null and the conversion is to an IDL type associated
 *      with [LegacyNullToEmptyString], then return the empty string.
 *   2. Let x be ? ToString(V).
 *   3. Return the DOMString value that represents the same sequence of
 *      code units as x.
 */
import { describe, expect, test } from "vitest";

import { makeDOMStringType } from "../../../02-idl/13-idl-types/utils";

describe("asDOMString - no extended attributes", () => {
  const T = makeDOMStringType();

  test.each([
    ["", ""],
    ["abc", "abc"],
    [42, "42"],
    [3.14, "3.14"],
    [true, "true"],
    [false, "false"],
    [null, "null"], // null without [LegacyNullToEmptyString] coerces via ToString
    [undefined, "undefined"],
    [0n, "0"],
    [[], ""],
    [[1, 2], "1,2"],
  ] as const)("ToString(%s) === %s", (input, expected) => {
    expect(T(input)).toBe(expected);
  });

  test("object -> calls toString", () => {
    expect(T({ toString: () => "hi" })).toBe("hi");
  });

  test("Symbol throws TypeError (ToString of Symbol throws)", () => {
    expect(() => T(Symbol("x"))).toThrow(TypeError);
  });

  test("surrogate halves are preserved (no scalar value conversion)", () => {
    // DOMString must preserve unmatched surrogates verbatim.
    const lonelyHigh = "\uD83D"; // unpaired high surrogate
    expect(T(lonelyHigh)).toBe(lonelyHigh);
  });
});

describe("asDOMString - [LegacyNullToEmptyString]", () => {
  const T = makeDOMStringType({ legacyNullToEmptyString: true });

  test("null -> empty string when annotated", () => {
    expect(T(null)).toBe("");
  });

  test("undefined still coerces via ToString (annotation only triggers on null)", () => {
    expect(T(undefined)).toBe("undefined");
  });

  test("other values unaffected by the annotation", () => {
    expect(T(0)).toBe("0");
    expect(T("x")).toBe("x");
  });
});
