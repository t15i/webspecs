/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * If a reflected IDL attribute has the type unsigned long:
 *
 *   The getter steps parse the content attribute value with the rules for
 *   parsing non-negative integers and return the parsed value when it is in
 *   the range [minimum, maximum]; when clamped to a range, out-of-range
 *   parsed values are clamped; otherwise the default value (or minimum) is
 *   returned.
 *
 *   The setter steps throw an "IndexSizeError" DOMException for 0 when
 *   limited to only non-negative numbers greater than zero, and otherwise
 *   set the content attribute to the given value when it is in range, or to
 *   the default value (or minimum) when it is not.
 */
import { describe, expect, test } from "vitest";

import { ReflectedUnsignedLong } from "lib/html";

import { makeElementReflectedTarget, makeReflectedIDLAttribute } from "./utils";

function get(
  contentAttributeValue: string | null,
  properties: object = {},
): number {
  const element = document.createElement("div");

  if (contentAttributeValue !== null) {
    element.setAttribute("data-ws-ulong", contentAttributeValue);
  }

  return ReflectedUnsignedLong.getter.call(
    makeElementReflectedTarget(element),
    makeReflectedIDLAttribute<ReflectedUnsignedLong.ReflectedIDLAttribute>(
      properties,
    ),
    "data-ws-ulong",
  );
}

function set(value: number, properties: object = {}): HTMLElement {
  const element = document.createElement("div");

  ReflectedUnsignedLong.setter.call(
    makeElementReflectedTarget(element),
    makeReflectedIDLAttribute<ReflectedUnsignedLong.ReflectedIDLAttribute>(
      properties,
    ),
    "data-ws-ulong",
    value,
  );

  return element;
}

describe("ReflectedUnsignedLong.getter", () => {
  test.each([
    ["42", 42],
    ["0", 0],
    ["2147483647", 2147483647],
  ] as const)("parses %j as %j", (value, expected) => {
    expect(get(value)).toBe(expected);
  });

  test.each([
    ["-3"],
    ["abc"],
    ["2147483648"], // above the maximum
    [null],
  ] as const)("returns 0 for unusable value %j", (value) => {
    expect(get(value)).toBe(0);
  });

  test("returns the default value for an unusable value", () => {
    expect(get(null, { defaultValue: 7 })).toBe(7);
  });

  describe("limited to only non-negative numbers greater than zero", () => {
    const limited = { limitedToOnlyPositiveNumbers: true };

    test("parses a positive value", () => {
      expect(get("42", limited)).toBe(42);
    });

    test.each([["0"], [null]] as const)(
      "returns the minimum (1) for unusable value %j",
      (value) => {
        expect(get(value, limited)).toBe(1);
      },
    );

    test("prefers the default value over the minimum", () => {
      expect(get("0", { ...limited, defaultValue: 10 })).toBe(10);
    });
  });

  describe("limited to only non-negative numbers greater than zero with fallback", () => {
    const limited = { limitedToOnlyPositiveNumbersWithFallback: true };

    test("returns the default value for a zero value", () => {
      expect(get("0", { ...limited, defaultValue: 10 })).toBe(10);
    });
  });

  describe("clamped to the range", () => {
    const clamped = { clampedToRange: [2, 5] };

    test.each([
      ["3", 3],
      ["1", 2], // clamped up to the minimum
      ["9", 5], // clamped down to the maximum
    ] as const)("reflects %j as %j", (value, expected) => {
      expect(get(value, clamped)).toBe(expected);
    });

    test("falls back to the range minimum when the attribute is absent", () => {
      expect(get(null, clamped)).toBe(2);
    });

    test("does not clamp an unparseable value", () => {
      expect(get("abc", { ...clamped, defaultValue: 4 })).toBe(4);
    });
  });
});

describe("ReflectedUnsignedLong.setter", () => {
  test("sets the content attribute to the given in-range value", () => {
    expect(set(42).getAttribute("data-ws-ulong")).toBe("42");
    expect(set(0).getAttribute("data-ws-ulong")).toBe("0");
  });

  test.each([
    [-1, "0"],
    [2147483648, "0"],
  ] as const)(
    "replaces the out-of-range value %j with the minimum",
    (value, expected) => {
      expect(set(value).getAttribute("data-ws-ulong")).toBe(expected);
    },
  );

  test("replaces an out-of-range value with the default value when defined", () => {
    expect(
      set(2147483648, { defaultValue: 7 }).getAttribute("data-ws-ulong"),
    ).toBe("7");
  });

  test("uses the minimum of 1 when limited to only non-negative numbers greater than zero with fallback", () => {
    expect(
      set(2147483648, {
        limitedToOnlyPositiveNumbersWithFallback: true,
      }).getAttribute("data-ws-ulong"),
    ).toBe("1");
  });

  test('throws an "IndexSizeError" DOMException for 0 when limited to only non-negative numbers greater than zero', () => {
    let error: unknown;
    try {
      set(0, { limitedToOnlyPositiveNumbers: true });
    } catch (thrown) {
      error = thrown;
    }

    expect(error).toBeInstanceOf(DOMException);
    expect((error as DOMException).name).toBe("IndexSizeError");
  });
});
