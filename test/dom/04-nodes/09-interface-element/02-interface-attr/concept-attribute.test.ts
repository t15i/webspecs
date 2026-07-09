/**
 * @see https://html.spec.whatwg.org/multipage/dom.html#attributes
 *
 * Content attribute descriptors are associated with a class of Element
 * (keyed by the constructor's prototype) and resolved for an element by
 * walking up its prototype chain.
 */
import { describe, expect, test } from "vitest";

import { Element, type ContentAttributeDescriptor } from "lib/dom";

const descriptor = { prop: {} } as ContentAttributeDescriptor;

describe("Element content attribute registry", () => {
  const div = () => document.createElement("div");

  test("returns undefineContentAttributed when no descriptor is registered", () => {
    expect(
      Element.getContentAttributeDescriptor(div(), "data-ws-unregistered"),
    ).toBeUndefined();
  });

  test("resolves a descriptor registered for the element's own class", () => {
    Element.defineContentAttribute(HTMLDivElement, "data-ws-own", {
      ...descriptor,
    });

    expect(
      Element.getContentAttributeDescriptor(div(), "data-ws-own"),
    ).toBeDefined();
  });

  test("resolves a descriptor registered on an ancestor class", () => {
    Element.defineContentAttribute(HTMLElement, "data-ws-inherited", {
      ...descriptor,
    });

    expect(
      Element.getContentAttributeDescriptor(div(), "data-ws-inherited"),
    ).toBeDefined();
    expect(
      Element.getContentAttributeDescriptor(
        document.createElement("span"),
        "data-ws-inherited",
      ),
    ).toBeDefined();
  });

  test("the descriptor nearest to the element's class wins", () => {
    const derived: ContentAttributeDescriptor = {};
    Element.defineContentAttribute(HTMLElement, "data-ws-nearest", descriptor);
    Element.defineContentAttribute(HTMLDivElement, "data-ws-nearest", derived);

    expect(
      Element.getContentAttributeDescriptor(div(), "data-ws-nearest"),
    ).toEqual(derived);
    expect(
      Element.getContentAttributeDescriptor(
        document.createElement("span"),
        "data-ws-nearest",
      ),
    ).toEqual(descriptor);
  });

  test.each(["toString", "hasOwnProperty", "constructor", "valueOf"])(
    "Object.prototype member %j does not leak as a descriptor",
    (name) => {
      // Guarantee at least one registration exists on the prototype chain so
      // the lookup actually reads from a populated store.
      Element.defineContentAttribute(HTMLElement, "data-ws-populate", {});

      expect(
        Element.getContentAttributeDescriptor(div(), name),
      ).toBeUndefined();
    },
  );

  test('"__proto__" is stored as a regular name and does not corrupt the store', () => {
    Element.defineContentAttribute(HTMLElement, "__proto__", descriptor);

    expect(Element.getContentAttributeDescriptor(div(), "__proto__")).toEqual(
      descriptor,
    );
    expect(
      Element.getContentAttributeDescriptor(div(), "data-ws-still-empty"),
    ).toBeUndefined();
  });
});
