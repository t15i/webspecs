/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * A reflected IDL attribute treated as a URL must have the type "USVString".
 * The rule fires only when the `treatedAsURL` metadata is present on the
 * attribute.
 */
import { describe, expect, test } from "vitest";

import { validateRegularAttribute } from "lib/webidl";

import {
  makeDOMStringType,
  makeUSVStringType,
} from "../../../../webidl/02-idl/13-idl-types/utils";
import { makeReflectedRegularAttribute } from "./utils";

describe("treated as a URL - type constraint", () => {
  test("does not throw for a USVString attribute", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeUSVStringType(), {
          treatedAsURL: true,
        }),
      ),
    ).not.toThrow();
  });

  test("throws for a DOMString attribute", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeDOMStringType(), {
          treatedAsURL: true,
        }),
      ),
    ).toThrow(TypeError);
  });

  test("does not throw when the attribute is not treated as a URL", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeDOMStringType()),
      ),
    ).not.toThrow();
  });
});
