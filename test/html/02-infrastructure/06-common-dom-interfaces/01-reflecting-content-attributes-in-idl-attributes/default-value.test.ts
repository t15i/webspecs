/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * A reflected IDL attribute with a default value must have the type "long",
 * "unsigned long", or "double". The rule fires only when the `defaultValue`
 * metadata is present on the attribute.
 */
import { describe, expect, test } from "vitest";

import { validateRegularAttribute } from "lib/webidl";

import {
  makeDOMStringType,
  makeDoubleType,
  makeLongType,
  makeUnsignedLongType,
} from "../../../../webidl/02-idl/13-idl-types/utils";
import { makeReflectedRegularAttribute } from "./utils";

describe("default value - type constraint", () => {
  test.each([
    ["long", makeLongType],
    ["unsigned long", makeUnsignedLongType],
    ["double", makeDoubleType],
  ] as const)("does not throw for a %s attribute", (_name, makeType) => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeType(), { defaultValue: 5 }),
      ),
    ).not.toThrow();
  });

  test("throws for a DOMString attribute", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeDOMStringType(), { defaultValue: 5 }),
      ),
    ).toThrow(TypeError);
  });

  test("does not throw when the attribute has no default value", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeDOMStringType()),
      ),
    ).not.toThrow();
  });
});
