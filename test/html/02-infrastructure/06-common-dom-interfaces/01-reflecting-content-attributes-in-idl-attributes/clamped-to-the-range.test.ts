/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * A reflected IDL attribute that is clamped to the range must have the type
 * "unsigned long". The rule fires only when the `clampedToRange` metadata is
 * present on the attribute.
 */
import { describe, expect, test } from "vitest";

import { validateRegularAttribute } from "lib/webidl";

import {
  makeDOMStringType,
  makeLongType,
  makeUnsignedLongType,
} from "../../../../webidl/02-idl/13-idl-types/utils";
import { makeReflectedRegularAttribute } from "./utils";

describe("clamped to the range - type constraint", () => {
  test("does not throw for an unsigned long attribute", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeUnsignedLongType(), {
          clampedToRange: [0, 10],
        }),
      ),
    ).not.toThrow();
  });

  test.each([
    ["long", makeLongType],
    ["DOMString", makeDOMStringType],
  ] as const)("throws for a %s attribute", (_name, makeType) => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeType(), { clampedToRange: [0, 10] }),
      ),
    ).toThrow(TypeError);
  });

  test("does not throw when the attribute is not clamped", () => {
    expect(() =>
      validateRegularAttribute(makeReflectedRegularAttribute(makeLongType())),
    ).not.toThrow();
  });
});
