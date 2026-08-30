/**
 * @see https://dom.spec.whatwg.org/#concept-id
 *
 * An element's ID is what its `id` content attribute carries, and the
 * attribute change steps unset it for the empty string. An element with no
 * `id`, and one whose `id` is empty, both have no ID.
 */
import { describe, expect, test } from "vitest";

import { getID } from "lib/dom";

describe("getID", () => {
  const div = (id?: string) => {
    const element = document.createElement("div");

    if (id !== undefined) {
      element.setAttribute("id", id);
    }

    return element;
  };

  test("returns the value of the id content attribute", () => {
    expect(getID(div("ws-id"))).toBe("ws-id");
  });

  test("returns null for an element without the attribute", () => {
    // What element.id answers here is "", which is what makes it useless for
    // the question: it cannot tell an absent ID from an empty one.
    expect(div().id).toBe("");
    expect(getID(div())).toBeNull();
  });

  test("returns null for an element whose id is empty", () => {
    expect(getID(div(""))).toBeNull();
  });
});
