/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#attr-associated-element
 *
 * If a reflected IDL attribute has the type T?, where T is an element type:
 *
 *   The getter steps return this's attr-associated element: the explicitly
 *   set attr-element (when it exists and shares the element's root), or the
 *   first element in tree order whose ID matches the content attribute value
 *   and that implements T.
 *
 *   The setter steps set the content attribute to the empty string and the
 *   explicitly set attr-element to a weak reference to the given value, or
 *   delete both when the given value is null.
 *
 *   The attribute change steps reset the explicitly set attr-element.
 */
import { afterEach, describe, expect, test } from "vitest";

import { getAssociatedElement, ReflectedNullableElement } from "lib/html";

import { makeElementReflectedTarget, makeReflectedIDLAttribute } from "./utils";

type TargetAssociations =
  ReflectedNullableElement.ReflectedTargetAssociations<HTMLSpanElement>;

const reflectedIDLAttribute = makeReflectedIDLAttribute<
  ReflectedNullableElement.ReflectedIDLAttribute<HTMLSpanElement>
>({ type: { innerType: { T: HTMLSpanElement } } });

function makeTarget(element: HTMLElement): TargetAssociations {
  return {
    ...makeElementReflectedTarget(element),
    explicitlySetElement: null,
    getAssociatedElement,
  };
}

const container = document.createElement("div");

afterEach(() => {
  container.remove();
  container.replaceChildren();
});

function insert(id?: string): { span: HTMLSpanElement; host: HTMLElement } {
  const span = document.createElement("span");

  if (id !== undefined) {
    span.id = id;
  }

  const host = document.createElement("div");

  container.append(span, host);
  document.body.append(container);

  return { span, host };
}

describe("ReflectedNullableElement.getter", () => {
  test("resolves the element whose ID is the content attribute value", () => {
    const { span, host } = insert("ws-ref-target");
    host.setAttribute("data-ws-ref", "ws-ref-target");

    expect(
      ReflectedNullableElement.getter.call(
        makeTarget(host),
        reflectedIDLAttribute,
        "data-ws-ref",
      ),
    ).toBe(span);
  });

  test("returns null when no element matches the content attribute value", () => {
    const { host } = insert();
    host.setAttribute("data-ws-ref", "ws-ref-missing");

    expect(
      ReflectedNullableElement.getter.call(
        makeTarget(host),
        reflectedIDLAttribute,
        "data-ws-ref",
      ),
    ).toBeNull();
  });

  test("returns null when no element matches the content attribute value (host disconnected)", () => {
    const { host } = insert("ws-ref-target");
    host.setAttribute("data-ws-ref", "ws-ref-target");

    host.remove();

    expect(
      ReflectedNullableElement.getter.call(
        makeTarget(host),
        reflectedIDLAttribute,
        "data-ws-ref",
      ),
    ).toBeNull();
  });

  test("returns null when the matching element does not implement T", () => {
    const { host } = insert();
    const paragraph = document.createElement("p");
    paragraph.id = "ws-ref-wrong-type";
    container.append(paragraph);
    host.setAttribute("data-ws-ref", "ws-ref-wrong-type");

    expect(
      ReflectedNullableElement.getter.call(
        makeTarget(host),
        reflectedIDLAttribute,
        "data-ws-ref",
      ),
    ).toBeNull();
  });

  test("returns null when the content attribute is absent", () => {
    const { host } = insert();

    expect(
      ReflectedNullableElement.getter.call(
        makeTarget(host),
        reflectedIDLAttribute,
        "data-ws-ref",
      ),
    ).toBeNull();
  });

  test("prefers the explicitly set element over the content attribute", () => {
    const { host } = insert("ws-ref-ignored");
    host.setAttribute("data-ws-ref", "ws-ref-ignored");

    const explicit = document.createElement("span");
    container.append(explicit);

    const target = makeTarget(host);
    target.explicitlySetElement = new WeakRef(explicit);

    expect(
      ReflectedNullableElement.getter.call(
        target,
        reflectedIDLAttribute,
        "data-ws-ref",
      ),
    ).toBe(explicit);
  });

  test("returns null when the explicitly set element is in another root", () => {
    const { host } = insert("ws-ref-other-root");
    host.setAttribute("data-ws-ref", "ws-ref-other-root");

    const detached = document.createElement("span");

    const target = makeTarget(host);
    target.explicitlySetElement = new WeakRef(detached);

    expect(
      ReflectedNullableElement.getter.call(
        target,
        reflectedIDLAttribute,
        "data-ws-ref",
      ),
    ).toBeNull();
  });
});

describe("ReflectedNullableElement.setter", () => {
  test("sets the content attribute to the empty string and remembers the element", () => {
    const { span, host } = insert();
    const target = makeTarget(host);

    ReflectedNullableElement.setter.call(
      target,
      reflectedIDLAttribute,
      "data-ws-ref",
      span,
    );

    expect(host.getAttribute("data-ws-ref")).toBe("");
    expect(target.explicitlySetElement?.deref()).toBe(span);
  });

  test("null deletes the content attribute and forgets the element", () => {
    const { span, host } = insert();
    host.setAttribute("data-ws-ref", "whatever");

    const target = makeTarget(host);
    target.explicitlySetElement = new WeakRef(span);

    ReflectedNullableElement.setter.call(
      target,
      reflectedIDLAttribute,
      "data-ws-ref",
      null,
    );

    expect(host.hasAttribute("data-ws-ref")).toBe(false);
    expect(target.explicitlySetElement).toBeNull();
  });
});

describe("ReflectedNullableElement.attributeChangeSteps", () => {
  function run(
    target: TargetAssociations,
    localName: string,
    namespace: string | null,
  ): void {
    ReflectedNullableElement.attributeChangeSteps.call(
      target,
      reflectedIDLAttribute,
      "data-ws-ref",
      document.createElement("span"),
      localName,
      null,
      null,
      namespace,
    );
  }

  test("resets the explicitly set element when its content attribute changes", () => {
    const { span, host } = insert();
    const target = makeTarget(host);
    target.explicitlySetElement = new WeakRef(span);

    run(target, "data-ws-ref", null);

    expect(target.explicitlySetElement).toBeNull();
  });

  test.each([
    ["another local name", "data-ws-other", null],
    ["a non-null namespace", "data-ws-ref", "urn:example"],
  ] as const)(
    "keeps the explicitly set element for %s",
    (_, localName, namespace) => {
      const { span, host } = insert();
      const target = makeTarget(host);
      target.explicitlySetElement = new WeakRef(span);

      run(target, localName, namespace);

      expect(target.explicitlySetElement).not.toBeNull();
    },
  );
});
