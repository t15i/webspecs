/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#cached-attr-associated-elements-object
 *
 * If a reflected IDL attribute has the type FrozenArray<T>?, where T is an
 * element type:
 *
 *   The getter steps return this's attr-associated elements, converted to a
 *   FrozenArray<T>?. The converted object is cached, and the cached object
 *   is returned again as long as the contents of the attr-associated
 *   elements do not change.
 *
 *   The setter steps set the content attribute to the empty string and the
 *   explicitly set attr-elements to a list of weak references to the given
 *   elements, or delete both when the given value is null.
 *
 *   The attribute change steps reset the explicitly set attr-elements.
 */
import { afterEach, describe, expect, test } from "vitest";

import {
  getAssociatedElements,
  ReflectedNullableFrozenArrayOfElements,
} from "lib/html";

import { makeElementReflectedTarget, makeReflectedIDLAttribute } from "./utils";

type TargetAssociations =
  ReflectedNullableFrozenArrayOfElements.ReflectedTargetAssociations<HTMLSpanElement>;

type IDLAttribute =
  ReflectedNullableFrozenArrayOfElements.ReflectedIDLAttribute<HTMLSpanElement>;

// A minimal FrozenArray<T>? conversion: null stays null, and a list of
// elements becomes a frozen copy (the real converter lives in @webidl).
const reflectedIDLAttribute = makeReflectedIDLAttribute<IDLAttribute>({
  type: Object.assign(
    (elements: readonly HTMLSpanElement[] | null) =>
      elements === null ? null : Object.freeze([...elements]),
    { innerType: { T: { T: HTMLSpanElement } } },
  ),
});

function makeTarget(element: HTMLElement): TargetAssociations {
  return {
    ...makeElementReflectedTarget(element),
    explicitlySetElements: null,
    cachedAssociatedElements: null,
    getAssociatedElements,
  };
}

// Pin the getter's generic parameter to HTMLSpanElement; `Function.call`
// cannot pass explicit type arguments.
const getter: (
  this: TargetAssociations,
  reflectedIDLAttribute: IDLAttribute,
  reflectedContentAttributeName: string,
) => readonly HTMLSpanElement[] | null =
  ReflectedNullableFrozenArrayOfElements.getter;

function get(target: TargetAssociations): readonly HTMLSpanElement[] | null {
  return getter.call(target, reflectedIDLAttribute, "data-ws-refs");
}

const container = document.createElement("div");

afterEach(() => {
  container.remove();
  container.replaceChildren();
});

function insert(...ids: string[]): {
  spans: HTMLSpanElement[];
  host: HTMLElement;
} {
  const spans = ids.map((id) => {
    const span = document.createElement("span");
    span.id = id;
    return span;
  });

  const host = document.createElement("div");

  container.append(...spans, host);
  document.body.append(container);

  return { spans, host };
}

describe("ReflectedNullableFrozenArrayOfElements.getter", () => {
  test("returns null when the content attribute is absent and nothing is cached", () => {
    const { host } = insert();

    expect(get(makeTarget(host))).toBeNull();
  });

  test("returns the attr-associated elements as a frozen array", () => {
    const { spans, host } = insert("ws-arr-a", "ws-arr-b");
    host.setAttribute("data-ws-refs", "ws-arr-a ws-arr-b");

    const elements = get(makeTarget(host));

    expect(elements).toEqual(spans);
    expect(Object.isFrozen(elements)).toBe(true);
  });

  test("returns the cached object while the contents do not change", () => {
    const { host } = insert("ws-arr-a", "ws-arr-b");
    host.setAttribute("data-ws-refs", "ws-arr-a ws-arr-b");

    const target = makeTarget(host);

    expect(get(target)).toBe(get(target));
  });

  test("returns a new object when the contents change", () => {
    const { spans, host } = insert("ws-arr-a", "ws-arr-b");
    host.setAttribute("data-ws-refs", "ws-arr-a ws-arr-b");

    const target = makeTarget(host);
    const first = get(target);

    host.setAttribute("data-ws-refs", "ws-arr-b");
    const second = get(target);

    expect(second).not.toBe(first);
    expect(second).toEqual([spans[1]]);
  });

  test("returns null when the content attribute is removed after caching", () => {
    const { host } = insert("ws-arr-a");
    host.setAttribute("data-ws-refs", "ws-arr-a");

    const target = makeTarget(host);
    get(target);

    host.removeAttribute("data-ws-refs");

    expect(get(target)).toBeNull();
    expect(target.cachedAssociatedElements).toBeNull();
  });

  test("prefers the explicitly set elements over the content attribute", () => {
    const { spans, host } = insert("ws-arr-ignored");
    host.setAttribute("data-ws-refs", "ws-arr-ignored");

    const explicit = document.createElement("span");
    container.append(explicit);

    const target = makeTarget(host);
    target.explicitlySetElements = [new WeakRef(explicit)];

    expect(get(target)).toEqual([explicit]);
    expect(spans).toHaveLength(1);
  });
});

describe("ReflectedNullableFrozenArrayOfElements.setter", () => {
  test("sets the content attribute to the empty string and remembers the elements", () => {
    const { spans, host } = insert("ws-arr-a", "ws-arr-b");
    const target = makeTarget(host);

    ReflectedNullableFrozenArrayOfElements.setter.call(
      target,
      reflectedIDLAttribute,
      "data-ws-refs",
      spans,
    );

    expect(host.getAttribute("data-ws-refs")).toBe("");
    expect(target.explicitlySetElements?.map((ref) => ref.deref())).toEqual(
      spans,
    );
  });

  test("null deletes the content attribute and forgets the elements", () => {
    const { spans, host } = insert("ws-arr-a");
    host.setAttribute("data-ws-refs", "whatever");

    const target = makeTarget(host);
    target.explicitlySetElements = spans.map((span) => new WeakRef(span));

    ReflectedNullableFrozenArrayOfElements.setter.call(
      target,
      reflectedIDLAttribute,
      "data-ws-refs",
      null,
    );

    expect(host.hasAttribute("data-ws-refs")).toBe(false);
    expect(target.explicitlySetElements).toBeNull();
  });
});

describe("ReflectedNullableFrozenArrayOfElements.attributeChangeSteps", () => {
  function run(
    target: TargetAssociations,
    localName: string,
    namespace: string | null,
  ): void {
    ReflectedNullableFrozenArrayOfElements.attributeChangeSteps.call(
      target,
      reflectedIDLAttribute,
      "data-ws-refs",
      document.createElement("span"),
      localName,
      null,
      null,
      namespace,
    );
  }

  test("resets the explicitly set elements when its content attribute changes", () => {
    const { spans, host } = insert("ws-arr-a");
    const target = makeTarget(host);
    target.explicitlySetElements = spans.map((span) => new WeakRef(span));

    run(target, "data-ws-refs", null);

    expect(target.explicitlySetElements).toBeNull();
  });

  test.each([
    ["another local name", "data-ws-other", null],
    ["a non-null namespace", "data-ws-refs", "urn:example"],
  ] as const)(
    "keeps the explicitly set elements for %s",
    (_, localName, namespace) => {
      const { spans, host } = insert("ws-arr-a");
      const target = makeTarget(host);
      target.explicitlySetElements = spans.map((span) => new WeakRef(span));

      run(target, localName, namespace);

      expect(target.explicitlySetElements).not.toBeNull();
    },
  );
});
