/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * A reflected IDL attribute limited to only non-negative numbers must have the
 * type "long". The rule fires only when the `limitedToOnlyNonNegativeNumbers`
 * metadata is present on the attribute.
 */
import { describe, expect, test } from "vitest";

import { validateRegularAttribute } from "lib/webidl";

import {
  makeLongType,
  makeUnsignedLongType,
} from "../../../../webidl/02-idl/13-idl-types/utils";
import { makeReflectedRegularAttribute } from "./utils";

describe("limited to only non-negative numbers - type constraint", () => {
  test("does not throw for a long attribute", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeLongType(), {
          limitedToOnlyNonNegativeNumbers: true,
        }),
      ),
    ).not.toThrow();
  });

  test("throws for an unsigned long attribute", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeUnsignedLongType(), {
          limitedToOnlyNonNegativeNumbers: true,
        }),
      ),
    ).toThrow(TypeError);
  });

  test("does not throw when the attribute is not limited", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeUnsignedLongType()),
      ),
    ).not.toThrow();
  });
});
