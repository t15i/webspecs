/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * If a reflected IDL attribute has the type long:
 *
 *   The getter steps are to parse the content attribute value with the rules
 *   for parsing integers (non-negative integers when the reflected IDL
 *   attribute is limited to only non-negative numbers) and return the parsed
 *   value when it is in the long range; otherwise return the default value
 *   (or -1 when limited to only non-negative numbers, or 0).
 *
 *   The setter steps throw an "IndexSizeError" DOMException for negative
 *   values when limited to only non-negative numbers, and otherwise set the
 *   content attribute to the shortest possible valid integer string.
 */
import { describe, expect, test } from "vitest";

import { ReflectedLong } from "lib/html";

import { makeElementReflectedTarget, makeReflectedIDLAttribute } from "./utils";

function get(
  contentAttributeValue: string | null,
  properties: object = {},
): number {
  const element = document.createElement("div");

  if (contentAttributeValue !== null) {
    element.setAttribute("data-ws-long", contentAttributeValue);
  }

  return ReflectedLong.getter.call(
    makeElementReflectedTarget(element),
    makeReflectedIDLAttribute<ReflectedLong.ReflectedIDLAttribute>(properties),
    "data-ws-long",
  );
}

describe("ReflectedLong.getter", () => {
  test.each([
    ["42", 42],
    ["-7", -7],
    ["2147483647", 2147483647],
    ["-2147483648", -2147483648],
  ] as const)("parses %j as %j", (value, expected) => {
    expect(get(value)).toBe(expected);
  });

  test.each([
    ["abc"],
    ["2147483648"], // LONG_MAX + 1
    ["-2147483649"], // LONG_MIN - 1
    [null],
  ] as const)("returns 0 for unusable value %j", (value) => {
    expect(get(value)).toBe(0);
  });

  test.each([["abc"], [null]] as const)(
    "returns the default value for unusable value %j",
    (value) => {
      expect(get(value, { defaultValue: 5 })).toBe(5);
    },
  );

  describe("limited to only non-negative numbers", () => {
    const limited = { limitedToOnlyNonNegativeNumbers: true };

    test("parses a non-negative value", () => {
      expect(get("42", limited)).toBe(42);
    });

    test.each([["-7"], ["abc"], [null]] as const)(
      "returns -1 for unusable value %j",
      (value) => {
        expect(get(value, limited)).toBe(-1);
      },
    );

    test("prefers the default value over -1", () => {
      expect(get(null, { ...limited, defaultValue: 5 })).toBe(5);
    });
  });
});

describe("ReflectedLong.setter", () => {
  test.each([
    [42, "42"],
    [-7, "-7"],
  ] as const)("sets the content attribute for %j to %j", (value, expected) => {
    const element = document.createElement("div");

    ReflectedLong.setter.call(
      makeElementReflectedTarget(element),
      makeReflectedIDLAttribute<ReflectedLong.ReflectedIDLAttribute>(),
      "data-ws-long",
      value,
    );

    expect(element.getAttribute("data-ws-long")).toBe(expected);
  });

  test('throws an "IndexSizeError" DOMException for a negative value when limited to only non-negative numbers', () => {
    const element = document.createElement("div");

    let error: unknown;
    try {
      ReflectedLong.setter.call(
        makeElementReflectedTarget(element),
        makeReflectedIDLAttribute<ReflectedLong.ReflectedIDLAttribute>({
          limitedToOnlyNonNegativeNumbers: true,
        }),
        "data-ws-long",
        -1,
      );
    } catch (thrown) {
      error = thrown;
    }

    expect(error).toBeInstanceOf(DOMException);
    expect((error as DOMException).name).toBe("IndexSizeError");
    expect(element.hasAttribute("data-ws-long")).toBe(false);
  });
});
