/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#attr-associated-elements
 *
 *   ... Otherwise, if contentAttributeValue is not null:
 *     1. Let tokens be contentAttributeValue, split on ASCII whitespace.
 *     2. For each id of tokens: ... the first element candidate, in tree
 *        order, that meets the following criteria: candidate's root is the
 *        same as element's root, candidate's ID is id, and candidate
 *        implements T. If no such element exists, then continue.
 */
import { afterEach, describe, expect, test } from "vitest";

import {
  getAssociatedElements,
  ReflectedNullableFrozenArrayOfElements,
} from "lib/html";

import {
  makeElementReflectedTarget as makeBaseTarget,
  makeReflectedIDLAttribute,
} from "./utils";

type TargetAssociations =
  ReflectedNullableFrozenArrayOfElements.ReflectedTargetAssociations<HTMLElement>;

type IDLAttribute =
  ReflectedNullableFrozenArrayOfElements.ReflectedIDLAttribute<HTMLElement>;

function makeElementReflectedTarget(element: HTMLElement): TargetAssociations {
  return {
    ...makeBaseTarget(element),
    explicitlySetElements: null,
    cachedAssociatedElements: null,
  } as unknown as TargetAssociations;
}

const reflectedIDLAttribute = makeReflectedIDLAttribute<IDLAttribute>({
  type: { innerType: { T: { T: HTMLElement } } },
});

describe("getAssociatedElements", () => {
  const container = document.createElement("div");

  afterEach(() => {
    container.remove();
    container.replaceChildren();
  });

  function insert(...ids: string[]): HTMLElement[] {
    const elements = ids.map((id) => {
      const element = document.createElement("span");
      element.id = id;
      return element;
    });

    const host = document.createElement("div");

    container.append(...elements, host);
    document.body.append(container);

    return [...elements, host];
  }

  test("resolves ids separated by any ASCII whitespace, in token order", () => {
    const [a, b, c, host] = insert("ws-el-a", "ws-el-b", "ws-el-c");
    host!.setAttribute("data-ws-refs", "ws-el-b\n\tws-el-a \r ws-el-c");

    const elements = getAssociatedElements.call(
      makeElementReflectedTarget(host!),
      reflectedIDLAttribute,
      "data-ws-refs",
    );

    expect(elements).toEqual([b, a, c]);
  });

  test("skips ids that do not resolve to an element", () => {
    const [a, host] = insert("ws-el-only");
    host!.setAttribute("data-ws-refs", "ws-el-missing  ws-el-only ");

    const elements = getAssociatedElements.call(
      makeElementReflectedTarget(host!),
      reflectedIDLAttribute,
      "data-ws-refs",
    );

    expect(elements).toEqual([a]);
  });

  test("returns an empty list for a whitespace-only attribute value", () => {
    const [host] = insert();
    host!.setAttribute("data-ws-refs", " \t\n ");

    const elements = getAssociatedElements.call(
      makeElementReflectedTarget(host!),
      reflectedIDLAttribute,
      "data-ws-refs",
    );

    expect(elements).toEqual([]);
  });

  test("returns null when the content attribute is absent", () => {
    const [host] = insert();

    const elements = getAssociatedElements.call(
      makeElementReflectedTarget(host!),
      reflectedIDLAttribute,
      "data-ws-refs",
    );

    expect(elements).toBeNull();
  });

  test("returns the explicitly set elements that share the element's root", () => {
    const [a, b, host] = insert("ws-el-x", "ws-el-y");
    const detached = document.createElement("span");

    const target = makeElementReflectedTarget(host!);
    target.explicitlySetElements = [
      new WeakRef(a!),
      new WeakRef(detached),
      new WeakRef(b!),
    ];

    const elements = getAssociatedElements.call(
      target,
      reflectedIDLAttribute,
      "data-ws-refs",
    );

    expect(elements).toEqual([a, b]);
  });

  test("keeps the explicitly set elements a shadow root reaches out to", () => {
    const [outside, sibling, host] = insert("ws-el-out", "ws-el-sibling");

    const inner = document.createElement("div");
    host!.attachShadow({ mode: "open" }).append(inner);

    const inSibling = document.createElement("span");
    sibling!.attachShadow({ mode: "open" }).append(inSibling);

    const target = makeElementReflectedTarget(inner);
    target.explicitlySetElements = [
      new WeakRef(outside!),
      new WeakRef(inSibling),
    ];

    const elements = getAssociatedElements.call(
      target,
      reflectedIDLAttribute,
      "data-ws-refs",
    );

    // Out of the shadow root into the light tree, but not across into
    // another one.
    expect(elements).toEqual([outside]);
  });
});

describe("the setter of an elements reflection and its own write", () => {
  const container = document.createElement("div");

  afterEach(() => {
    container.remove();
    container.replaceChildren();
  });

  test("writes the content attribute before it records the elements", () => {
    const host = document.createElement("div");
    const first = document.createElement("span");
    const second = document.createElement("span");
    container.append(host, first, second);
    document.body.append(container);

    const target = makeElementReflectedTarget(host);
    const setContentAttribute = target.setContentAttribute.bind(target);
    const recorded: Array<number | null> = [];

    // The change steps stand where the DOM runs them - inside the write - and
    // the setter records the elements only after them, as the spec orders it.
    target.setContentAttribute = (name, value) => {
      setContentAttribute(name, value);

      ReflectedNullableFrozenArrayOfElements.attributeChangeSteps.call(
        target,
        reflectedIDLAttribute,
        "data-ws-refs",
        host,
        name,
        null,
        value,
        null,
      );

      recorded.push(target.explicitlySetElements?.length ?? null);
    };

    ReflectedNullableFrozenArrayOfElements.setter.call(
      target,
      reflectedIDLAttribute,
      "data-ws-refs",
      [first, second],
    );

    expect(recorded).toEqual([null]);
    expect(target.explicitlySetElements).toHaveLength(2);
  });
});
