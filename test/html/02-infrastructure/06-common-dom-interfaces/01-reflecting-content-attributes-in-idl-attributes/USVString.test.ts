/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * If a reflected IDL attribute has the type USVString:
 *
 *   The getter steps return the empty string when the content attribute is
 *   absent. When the attribute is defined to contain a URL, the value is
 *   encoding-parsed-and-serialized relative to the element's node document;
 *   parsing failures (and non-URL attributes) reflect the value converted to
 *   a scalar value string.
 *
 *   The setter steps are to run set the content attribute with the given
 *   value.
 */
import { describe, expect, test } from "vitest";

import { ReflectedUSVString } from "lib/html";

import { makeElementReflectedTarget, makeReflectedIDLAttribute } from "./utils";

function get(
  contentAttributeValue: string | null,
  properties: object = {},
): string {
  const element = document.createElement("div");

  if (contentAttributeValue !== null) {
    element.setAttribute("data-ws-usv", contentAttributeValue);
  }

  return ReflectedUSVString.getter.call(
    makeElementReflectedTarget(element),
    makeReflectedIDLAttribute<ReflectedUSVString.ReflectedIDLAttribute>(
      properties,
    ),
    "data-ws-usv",
  );
}

describe("ReflectedUSVString.getter", () => {
  test("returns the content attribute value as-is", () => {
    expect(get("Hello")).toBe("Hello");
  });

  test("returns the empty string when the content attribute is absent", () => {
    expect(get(null)).toBe("");
  });

  test("converts the value into a scalar value string", () => {
    expect(get("\uD800a")).toBe("�a");
  });

  describe("treated as a URL", () => {
    const treatedAsURL = { treatedAsURL: true };

    test("resolves a relative URL against the element's node document", () => {
      expect(get("ws-relative-path", treatedAsURL)).toBe(
        new URL("ws-relative-path", document.baseURI).href,
      );
    });

    test("serializes an absolute URL", () => {
      expect(get("https://example.com/path?q=1", treatedAsURL)).toBe(
        "https://example.com/path?q=1",
      );
    });

    test("returns the raw value when URL parsing fails", () => {
      expect(get("http://[invalid", treatedAsURL)).toBe("http://[invalid");
    });
  });
});

describe("ReflectedUSVString.setter", () => {
  test("sets the content attribute to the given value", () => {
    const element = document.createElement("div");

    ReflectedUSVString.setter.call(
      makeElementReflectedTarget(element),
      makeReflectedIDLAttribute<ReflectedUSVString.ReflectedIDLAttribute>(),
      "data-ws-usv",
      "value",
    );

    expect(element.getAttribute("data-ws-usv")).toBe("value");
  });
});
