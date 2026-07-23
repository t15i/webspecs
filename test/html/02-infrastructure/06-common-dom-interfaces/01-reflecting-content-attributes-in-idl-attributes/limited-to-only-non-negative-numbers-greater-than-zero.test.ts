/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * A reflected IDL attribute limited to only non-negative numbers greater than
 * zero must have the type "unsigned long" or "double". The rule fires only when
 * the `limitedToOnlyPositiveNumbers` metadata is present on the attribute.
 */
import { describe, expect, test } from "vitest";

import { validateRegularAttribute } from "lib/webidl";

import {
  makeDoubleType,
  makeLongType,
  makeUnsignedLongType,
} from "../../../../webidl/02-idl/13-idl-types/utils";
import { makeReflectedRegularAttribute } from "./utils";

describe("limited to only non-negative numbers greater than zero - type constraint", () => {
  test.each([
    ["unsigned long", makeUnsignedLongType],
    ["double", makeDoubleType],
  ] as const)("does not throw for a %s attribute", (_name, makeType) => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeType(), {
          limitedToOnlyPositiveNumbers: true,
        }),
      ),
    ).not.toThrow();
  });

  test("throws for a long attribute", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeLongType(), {
          limitedToOnlyPositiveNumbers: true,
        }),
      ),
    ).toThrow(TypeError);
  });

  test("does not throw when the attribute is not limited", () => {
    expect(() =>
      validateRegularAttribute(makeReflectedRegularAttribute(makeLongType())),
    ).not.toThrow();
  });
});
