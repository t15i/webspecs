/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * A reflected IDL attribute limited to only non-negative numbers greater than
 * zero, with fallback, must have the type "unsigned long" - unlike the plain
 * "greater than zero" variant, "double" is not permitted here. The rule fires
 * only when the `limitedToOnlyPositiveNumbersWithFallback` metadata is present.
 */
import { describe, expect, test } from "vitest";

import { validateRegularAttribute } from "lib/webidl";

import {
  makeDoubleType,
  makeLongType,
  makeUnsignedLongType,
} from "../../../../webidl/02-idl/13-idl-types/utils";
import { makeReflectedRegularAttribute } from "./utils";

describe("limited to only non-negative numbers greater than zero, with fallback - type constraint", () => {
  test("does not throw for an unsigned long attribute", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeUnsignedLongType(), {
          limitedToOnlyPositiveNumbersWithFallback: true,
        }),
      ),
    ).not.toThrow();
  });

  test.each([
    ["double", makeDoubleType],
    ["long", makeLongType],
  ] as const)("throws for a %s attribute", (_name, makeType) => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeType(), {
          limitedToOnlyPositiveNumbersWithFallback: true,
        }),
      ),
    ).toThrow(TypeError);
  });

  test("does not throw when the attribute is not limited", () => {
    expect(() =>
      validateRegularAttribute(makeReflectedRegularAttribute(makeDoubleType())),
    ).not.toThrow();
  });
});
