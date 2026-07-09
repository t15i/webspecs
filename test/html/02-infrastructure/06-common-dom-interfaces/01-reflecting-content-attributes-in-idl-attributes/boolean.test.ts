/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * If a reflected IDL attribute has the type boolean:
 *
 *   The getter steps are to return true if this's content attribute is
 *   present, and false otherwise.
 *
 *   The setter steps are: if the given value is false, then run this's
 *   delete the content attribute; if the given value is true, then run
 *   this's set the content attribute with the empty string.
 */
import { describe, expect, test } from "vitest";

import { ReflectedBoolean } from "lib/html";

import { makeElementReflectedTarget, makeReflectedIDLAttribute } from "./utils";

const attribute =
  makeReflectedIDLAttribute<ReflectedBoolean.ReflectedIDLAttribute>();

describe("ReflectedBoolean.getter", () => {
  test.each([
    [null, false],
    ["", true],
    ["anything", true],
  ] as const)(
    "content attribute value %j reflects as %j",
    (value, expected) => {
      const element = document.createElement("div");

      if (value !== null) {
        element.setAttribute("data-ws-bool", value);
      }

      expect(
        ReflectedBoolean.getter.call(
          makeElementReflectedTarget(element),
          attribute,
          "data-ws-bool",
        ),
      ).toBe(expected);
    },
  );
});

describe("ReflectedBoolean.setter", () => {
  test("true sets the content attribute to the empty string", () => {
    const element = document.createElement("div");

    ReflectedBoolean.setter.call(
      makeElementReflectedTarget(element),
      attribute,
      "data-ws-bool",
      true,
    );

    expect(element.getAttribute("data-ws-bool")).toBe("");
  });

  test("false deletes the content attribute", () => {
    const element = document.createElement("div");
    element.setAttribute("data-ws-bool", "");

    ReflectedBoolean.setter.call(
      makeElementReflectedTarget(element),
      attribute,
      "data-ws-bool",
      false,
    );

    expect(element.hasAttribute("data-ws-bool")).toBe(false);
  });
});
