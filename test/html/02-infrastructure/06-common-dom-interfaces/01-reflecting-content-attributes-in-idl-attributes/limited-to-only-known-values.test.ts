/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * A reflected IDL attribute limited to only known values must have the type
 * "DOMString" or "DOMString?". The rule fires only when the
 * `limitedToOnlyKnownValues` metadata is present on the attribute.
 */
import { describe, expect, test } from "vitest";

import { validateRegularAttribute } from "lib/webidl";

import {
  makeDOMStringType,
  makeLongType,
  makeNullableType,
} from "../../../../webidl/02-idl/13-idl-types/utils";
import { makeReflectedRegularAttribute } from "./utils";

describe("limited to only known values - type constraint", () => {
  test("does not throw for a DOMString attribute", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeDOMStringType(), {
          limitedToOnlyKnownValues: true,
        }),
      ),
    ).not.toThrow();
  });

  test("does not throw for a nullable DOMString attribute", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeNullableType(makeDOMStringType()), {
          limitedToOnlyKnownValues: true,
        }),
      ),
    ).not.toThrow();
  });

  test("throws for a non-nullable non-DOMString attribute", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeLongType(), {
          limitedToOnlyKnownValues: true,
        }),
      ),
    ).toThrow(TypeError);
  });

  test("throws for a nullable non-DOMString attribute", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeNullableType(makeLongType()), {
          limitedToOnlyKnownValues: true,
        }),
      ),
    ).toThrow(TypeError);
  });

  test("does not throw when the attribute is not limited to known values", () => {
    expect(() =>
      validateRegularAttribute(makeReflectedRegularAttribute(makeLongType())),
    ).not.toThrow();
  });
});
