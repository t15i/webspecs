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

  test("returns null when the content attribute is the empty string", () => {
    const { host } = insert();
    host.setAttribute("data-ws-ref", "");

    // An element with no id attribute has no ID, and element.id cannot say
    // so - it answers "" for it, which a comparison would take for a match.
    // Measured in both engines: the platform resolves an empty IDREF to
    // nothing.
    expect(
      ReflectedNullableElement.getter.call(
        makeTarget(host),
        reflectedIDLAttribute,
        "data-ws-ref",
      ),
    ).toBeNull();
  });

  test("returns null when the only candidate carries an empty id", () => {
    const { span, host } = insert();
    span.setAttribute("id", "");
    host.setAttribute("data-ws-ref", "");

    // DOM unsets the ID for the empty string, so an element that carries one
    // has no ID either, and nothing can match it.
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

  test("resolves the explicitly set element out of a shadow root", () => {
    const { span, host } = insert();
    const inner = document.createElement("div");
    host.attachShadow({ mode: "open" }).append(inner);

    const target = makeTarget(inner);
    target.explicitlySetElement = new WeakRef(span);

    // The light tree is the root the shadow root hangs under through its
    // host, which is where a reference is allowed to point. Measured in both
    // engines: the platform resolves it.
    expect(
      ReflectedNullableElement.getter.call(
        target,
        reflectedIDLAttribute,
        "data-ws-ref",
      ),
    ).toBe(span);
  });

  test("returns null when the explicitly set element is inside a shadow root", () => {
    const { host } = insert();
    const inner = document.createElement("span");
    host.attachShadow({ mode: "open" }).append(inner);

    const target = makeTarget(host);
    target.explicitlySetElement = new WeakRef(inner);

    expect(
      ReflectedNullableElement.getter.call(
        target,
        reflectedIDLAttribute,
        "data-ws-ref",
      ),
    ).toBeNull();
  });

  test("resolves an explicitly set element that is an ancestor of the element", () => {
    const { host } = insert();
    const inner = document.createElement("span");
    host.append(inner);

    const target = makeTarget(inner);
    target.explicitlySetElement = new WeakRef(host);

    // Nothing is a descendant of itself, so the host is not reached as its
    // own ancestor - it is reached as a descendant of the next one up.
    expect(
      ReflectedNullableElement.getter.call(
        target,
        reflectedIDLAttribute,
        "data-ws-ref",
      ),
    ).toBe(host);
  });

  test("returns null for an element that is the root of a detached tree", () => {
    const root = document.createElement("div");
    const inner = document.createElement("span");
    root.append(inner);

    const target = makeTarget(root);
    target.explicitlySetElement = new WeakRef(inner);

    // An element that is the root of its own tree has no ancestors, so
    // nothing is reachable from it - not even what it holds itself.
    expect(
      ReflectedNullableElement.getter.call(
        target,
        reflectedIDLAttribute,
        "data-ws-ref",
      ),
    ).toBeNull();
  });

  test("returns null when the explicitly set element is the root of a detached tree", () => {
    const root = document.createElement("div");
    const inner = document.createElement("span");
    root.append(inner);

    const target = makeTarget(inner);
    target.explicitlySetElement = new WeakRef(root);

    // The one shape where the steps and the engines part: the root is the
    // only shadow-including ancestor there is, and nothing is a descendant of
    // itself, so the steps answer null while both engines resolve. The steps
    // are what is implemented - see the remarks on the check.
    expect(
      ReflectedNullableElement.getter.call(
        target,
        reflectedIDLAttribute,
        "data-ws-ref",
      ),
    ).toBeNull();
  });

  test("returns null when the explicitly set element is in a sibling shadow root", () => {
    const { host } = insert();
    const sibling = document.createElement("div");
    container.append(sibling);

    const here = document.createElement("div");
    host.attachShadow({ mode: "open" }).append(here);

    const there = document.createElement("span");
    sibling.attachShadow({ mode: "open" }).append(there);

    const target = makeTarget(here);
    target.explicitlySetElement = new WeakRef(there);

    // Climbing out of one shadow root reaches the light tree, and the other
    // shadow root is not in it.
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

describe("ReflectedNullableElement.setter and the attribute change steps", () => {
  /**
   * The setter, with the attribute change steps standing where the DOM runs
   * them: inside the write itself.
   */
  function setWithChangeSteps(
    target: TargetAssociations,
    host: HTMLElement,
    value: HTMLSpanElement,
  ): Array<string | null> {
    const recorded: Array<string | null> = [];
    const setContentAttribute = target.setContentAttribute.bind(target);

    target.setContentAttribute = (name, attributeValue) => {
      setContentAttribute(name, attributeValue);

      ReflectedNullableElement.attributeChangeSteps.call(
        target,
        reflectedIDLAttribute,
        "data-ws-ref",
        host,
        name,
        null,
        attributeValue,
        null,
      );

      recorded.push(target.explicitlySetElement?.deref()?.localName ?? null);
    };

    ReflectedNullableElement.setter.call(
      target,
      reflectedIDLAttribute,
      "data-ws-ref",
      value,
    );

    return recorded;
  }

  test("writes the content attribute before it records the element", () => {
    const { span, host } = insert();
    const target = makeTarget(host);

    // The steps run in the order the spec gives them: the write comes first,
    // so the change steps it triggers have nothing recorded to unset, and the
    // element is recorded after them. Anything reading in between - a custom
    // element reaction, which the platform runs after the whole setter
    // instead - sees no element.
    expect(setWithChangeSteps(target, host, span)).toEqual([null]);

    expect(target.explicitlySetElement?.deref()).toBe(span);
    expect(
      ReflectedNullableElement.getter.call(
        target,
        reflectedIDLAttribute,
        "data-ws-ref",
      ),
    ).toBe(span);
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
