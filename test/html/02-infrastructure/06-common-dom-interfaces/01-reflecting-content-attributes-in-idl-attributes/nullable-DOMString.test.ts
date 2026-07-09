/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * If a reflected IDL attribute has the type DOMString?:
 *
 *   The getter steps are to return the content attribute value, mapped to
 *   the canonical keyword of the matched state (or null when no state is
 *   matched) when the attribute definition indicates an enumerated
 *   attribute.
 *
 *   The setter steps are to run delete the content attribute when the given
 *   value is null, and set the content attribute otherwise.
 */
import { describe, expect, test } from "vitest";

import { Element } from "lib/dom";
import {
  EnumeratedAttributeState,
  EnumeratedAttributeStates,
  ReflectedNullableDOMString,
} from "lib/html";

import {
  makeElementReflectedTarget,
  makeReflectedIDLAttribute as makeAttribute,
} from "./utils";

function makeReflectedIDLAttribute(
  limitedToOnlyKnownValues?: boolean,
): ReflectedNullableDOMString.ReflectedIDLAttribute {
  return makeAttribute<ReflectedNullableDOMString.ReflectedIDLAttribute>({
    limitedToOnlyKnownValues,
  });
}

const anonymous = new EnumeratedAttributeState({
  conformingKeywords: new Set(["anonymous"]),
});
const useCredentials = new EnumeratedAttributeState({
  conformingKeywords: new Set(["use-credentials"]),
});

describe("ReflectedNullableDOMString.getter", () => {
  test("returns the content attribute value as-is when not limited to only known values", () => {
    const target = makeElementReflectedTarget(document.createElement("div"));
    target.setContentAttribute("data-ws-nstr", "Hello");

    expect(
      ReflectedNullableDOMString.getter.call(
        target,
        makeReflectedIDLAttribute(),
        "data-ws-nstr",
      ),
    ).toBe("Hello");
  });

  test("returns null when the content attribute is absent", () => {
    const target = makeElementReflectedTarget(document.createElement("div"));

    expect(
      ReflectedNullableDOMString.getter.call(
        target,
        makeReflectedIDLAttribute(),
        "data-ws-nstr",
      ),
    ).toBeNull();
  });

  describe("limited to only known values with an enumerated attribute definition", () => {
    Element.defineContentAttribute(HTMLDivElement, "data-ws-nenum", {
      states: new EnumeratedAttributeStates({
        states: [anonymous, useCredentials],
        invalidValueDefault: anonymous,
      }),
    });

    const attribute = makeReflectedIDLAttribute(true);

    test("returns the canonical keyword of the matched state (case-insensitively)", () => {
      const target = makeElementReflectedTarget(document.createElement("div"));
      target.setContentAttribute("data-ws-nenum", "Use-Credentials");

      expect(
        ReflectedNullableDOMString.getter.call(
          target,
          attribute,
          "data-ws-nenum",
        ),
      ).toBe("use-credentials");
    });

    test("returns the canonical keyword of the invalid value default for unknown values", () => {
      const target = makeElementReflectedTarget(document.createElement("div"));
      target.setContentAttribute("data-ws-nenum", "bogus");

      expect(
        ReflectedNullableDOMString.getter.call(
          target,
          attribute,
          "data-ws-nenum",
        ),
      ).toBe("anonymous");
    });

    test("returns null when the attribute is absent and there is no missing value default", () => {
      const target = makeElementReflectedTarget(document.createElement("div"));

      expect(
        ReflectedNullableDOMString.getter.call(
          target,
          attribute,
          "data-ws-nenum",
        ),
      ).toBeNull();
    });
  });
});

describe("ReflectedNullableDOMString.setter", () => {
  test("sets the content attribute to the given string value", () => {
    const element = document.createElement("div");
    const target = makeElementReflectedTarget(element);

    ReflectedNullableDOMString.setter.call(
      target,
      makeReflectedIDLAttribute(),
      "data-ws-nstr",
      "value",
    );

    expect(element.getAttribute("data-ws-nstr")).toBe("value");
  });

  test("deletes the content attribute when the given value is null", () => {
    const element = document.createElement("div");
    element.setAttribute("data-ws-nstr", "value");
    const target = makeElementReflectedTarget(element);

    ReflectedNullableDOMString.setter.call(
      target,
      makeReflectedIDLAttribute(),
      "data-ws-nstr",
      null,
    );

    expect(element.hasAttribute("data-ws-nstr")).toBe(false);
  });
});
