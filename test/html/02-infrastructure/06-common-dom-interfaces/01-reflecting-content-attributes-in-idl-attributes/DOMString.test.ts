/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * If a reflected IDL attribute has the type DOMString:
 *
 *   The getter steps are to return the result of running get the content
 *   attribute, or the canonical keyword of the matched state when the
 *   attribute definition indicates an enumerated attribute and the reflected
 *   IDL attribute is limited to only known values.
 *
 *   The setter steps are to run set the content attribute with the given
 *   value.
 */
import { describe, expect, test } from "vitest";

import { Element } from "lib/dom";
import {
  EnumeratedAttributeState,
  EnumeratedAttributeStates,
  ReflectedDOMString,
} from "lib/html";

import {
  makeElementReflectedTarget,
  makeReflectedIDLAttribute as makeAttribute,
} from "./utils";

function makeReflectedIDLAttribute(
  limitedToOnlyKnownValues?: boolean,
): ReflectedDOMString.ReflectedIDLAttribute {
  return makeAttribute<ReflectedDOMString.ReflectedIDLAttribute>({
    limitedToOnlyKnownValues,
  });
}

function makeEnumeratedStates({
  missingValueDefault,
  invalidValueDefault,
}: {
  missingValueDefault?: EnumeratedAttributeState;
  invalidValueDefault?: EnumeratedAttributeState;
} = {}): EnumeratedAttributeStates {
  return new EnumeratedAttributeStates({
    states: [ltr, rtl],
    missingValueDefault,
    invalidValueDefault,
  });
}

const ltr = new EnumeratedAttributeState({
  conformingKeywords: new Set(["ltr"]),
});
const rtl = new EnumeratedAttributeState({
  conformingKeywords: new Set(["rtl"]),
});

describe("ReflectedDOMString.getter", () => {
  test("returns the content attribute value as-is when not limited to only known values", () => {
    const target = makeElementReflectedTarget(document.createElement("div"));
    target.setContentAttribute("data-ws-str", "Hello");

    expect(
      ReflectedDOMString.getter.call(
        target,
        makeReflectedIDLAttribute(),
        "data-ws-str",
      ),
    ).toBe("Hello");
  });

  test("returns the empty string when the content attribute is absent", () => {
    const target = makeElementReflectedTarget(document.createElement("div"));

    expect(
      ReflectedDOMString.getter.call(
        target,
        makeReflectedIDLAttribute(),
        "data-ws-str",
      ),
    ).toBe("");
  });

  test("returns the raw value when limited to only known values but no descriptor is registered", () => {
    const target = makeElementReflectedTarget(document.createElement("div"));
    target.setContentAttribute("data-ws-str", "Whatever");

    expect(
      ReflectedDOMString.getter.call(
        target,
        makeReflectedIDLAttribute(true),
        "data-ws-str",
      ),
    ).toBe("Whatever");
  });

  test("does not consult the registry when not limited to only known values", () => {
    Element.defineContentAttribute(HTMLDivElement, "data-ws-enum-skip", {
      states: makeEnumeratedStates(),
    });

    const target = makeElementReflectedTarget(document.createElement("div"));
    target.setContentAttribute("data-ws-enum-skip", "not-a-keyword");

    expect(
      ReflectedDOMString.getter.call(
        target,
        makeReflectedIDLAttribute(),
        "data-ws-enum-skip",
      ),
    ).toBe("not-a-keyword");
  });

  describe("limited to only known values with an enumerated attribute definition", () => {
    Element.defineContentAttribute(HTMLDivElement, "data-ws-enum", {
      states: makeEnumeratedStates(),
    });

    Element.defineContentAttribute(HTMLDivElement, "data-ws-enum-defaults", {
      states: makeEnumeratedStates({
        missingValueDefault: ltr,
        invalidValueDefault: rtl,
      }),
    });

    const attribute = makeReflectedIDLAttribute(true);

    test("returns the canonical keyword of the matched state (case-insensitively)", () => {
      const target = makeElementReflectedTarget(document.createElement("div"));
      target.setContentAttribute("data-ws-enum", "RTL");

      expect(
        ReflectedDOMString.getter.call(target, attribute, "data-ws-enum"),
      ).toBe("rtl");
    });

    test("returns the empty string when the value corresponds to no state", () => {
      const target = makeElementReflectedTarget(document.createElement("div"));
      target.setContentAttribute("data-ws-enum", "bogus");

      expect(
        ReflectedDOMString.getter.call(target, attribute, "data-ws-enum"),
      ).toBe("");
    });

    test("returns the empty string when the attribute is absent and there is no missing value default", () => {
      const target = makeElementReflectedTarget(document.createElement("div"));

      expect(
        ReflectedDOMString.getter.call(target, attribute, "data-ws-enum"),
      ).toBe("");
    });

    test("returns the canonical keyword of the missing value default when the attribute is absent", () => {
      const target = makeElementReflectedTarget(document.createElement("div"));

      expect(
        ReflectedDOMString.getter.call(
          target,
          attribute,
          "data-ws-enum-defaults",
        ),
      ).toBe("ltr");
    });

    test("returns the canonical keyword of the invalid value default for unknown values", () => {
      const target = makeElementReflectedTarget(document.createElement("div"));
      target.setContentAttribute("data-ws-enum-defaults", "bogus");

      expect(
        ReflectedDOMString.getter.call(
          target,
          attribute,
          "data-ws-enum-defaults",
        ),
      ).toBe("rtl");
    });
  });
});

describe("ReflectedDOMString.setter", () => {
  test("sets the content attribute to the given value", () => {
    const element = document.createElement("div");
    const target = makeElementReflectedTarget(element);

    ReflectedDOMString.setter.call(
      target,
      makeReflectedIDLAttribute(),
      "data-ws-str",
      "value",
    );

    expect(element.getAttribute("data-ws-str")).toBe("value");
  });
});
