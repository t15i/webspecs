/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * If a reflected IDL attribute has the type double:
 *
 *   The getter steps parse the content attribute value with the rules for
 *   parsing floating-point number values and return the parsed value unless
 *   it is an error, or the reflected IDL attribute is limited to only
 *   positive numbers and the parsed value is not greater than 0; otherwise
 *   the default value (or 0) is returned.
 *
 *   The setter steps return without setting anything when the reflected IDL
 *   attribute is limited to only positive numbers and the given value is not
 *   greater than 0, and otherwise set the content attribute to the best
 *   representation of the value as a floating-point number.
 */
import { describe, expect, test } from "vitest";

import { ReflectedDouble } from "lib/html";

import { makeElementReflectedTarget, makeReflectedIDLAttribute } from "./utils";

function get(
  contentAttributeValue: string | null,
  properties: object = {},
): number {
  const element = document.createElement("div");

  if (contentAttributeValue !== null) {
    element.setAttribute("data-ws-double", contentAttributeValue);
  }

  return ReflectedDouble.getter.call(
    makeElementReflectedTarget(element),
    makeReflectedIDLAttribute<ReflectedDouble.ReflectedIDLAttribute>(
      properties,
    ),
    "data-ws-double",
  );
}

function set(value: number, properties: object = {}): HTMLElement {
  const element = document.createElement("div");

  ReflectedDouble.setter.call(
    makeElementReflectedTarget(element),
    makeReflectedIDLAttribute<ReflectedDouble.ReflectedIDLAttribute>(
      properties,
    ),
    "data-ws-double",
    value,
  );

  return element;
}

describe("ReflectedDouble.getter", () => {
  test.each([
    ["1.5", 1.5],
    ["-2.5", -2.5],
    ["0", 0],
  ] as const)("parses %j as %j", (value, expected) => {
    expect(get(value)).toBe(expected);
  });

  test.each([["abc"], [null]] as const)(
    "returns 0 for unusable value %j",
    (value) => {
      expect(get(value)).toBe(0);
    },
  );

  test("returns the default value for an unusable value", () => {
    expect(get(null, { defaultValue: 2.5 })).toBe(2.5);
  });

  describe("limited to only positive numbers", () => {
    const limited = { limitedToOnlyPositiveNumbers: true };

    test("parses a positive value", () => {
      expect(get("1.5", limited)).toBe(1.5);
    });

    test.each([["-2.5"], ["0"]] as const)(
      "ignores the non-positive value %j",
      (value) => {
        expect(get(value, limited)).toBe(0);
        expect(get(value, { ...limited, defaultValue: 2.5 })).toBe(2.5);
      },
    );
  });
});

describe("ReflectedDouble.setter", () => {
  test("sets the content attribute to the best representation of the value", () => {
    expect(set(1.5).getAttribute("data-ws-double")).toBe("1.5");
    expect(set(-2.5).getAttribute("data-ws-double")).toBe("-2.5");
  });

  describe("limited to only positive numbers", () => {
    const limited = { limitedToOnlyPositiveNumbers: true };

    test("sets the content attribute for a positive value", () => {
      expect(set(0.5, limited).getAttribute("data-ws-double")).toBe("0.5");
    });

    test.each([[0], [-1.5]] as const)(
      "does not set the content attribute for the non-positive value %j",
      (value) => {
        expect(set(value, limited).hasAttribute("data-ws-double")).toBe(false);
      },
    );
  });
});
