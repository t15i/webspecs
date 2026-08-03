/**
 * @see https://webidl.spec.whatwg.org/#idl-constructors
 *
 * A constructor operation is recognised by its `kind`. An interface "was
 * declared with a constructor operation" exactly when one of its members has
 * kind `"constructor"`; `getConstructor` resolves that member. A constructor
 * has no identifier and no return type, so `validateConstructor` has nothing to
 * check.
 */
import { describe, expect, test } from "vitest";
import {
  Exposed,
  getConstructor,
  isConstructor,
  validateConstructor,
  type Interface,
} from "lib/webidl";

import { makeConstructor, makeOperation } from "../utils";
import { makeLongType } from "../../13-idl-types/utils";

function makeInterface(members: Interface["members"] = {}): Interface {
  return {
    identifier: "Example",
    extendedAttributes: { [Exposed]: "*" },
    inherit: null,
    members,
    staticMembers: {},
  };
}

describe("isConstructor", () => {
  test("returns true for a constructor member", () => {
    expect(isConstructor(makeConstructor({}))).toBe(true);
  });

  test("returns false for an operation member", () => {
    expect(isConstructor(makeOperation({}))).toBe(false);
  });
});

describe("getConstructor", () => {
  test("returns the constructor when the interface declares one", () => {
    const constructor = makeConstructor({ argumentTypes: [makeLongType()] });
    const iface = makeInterface({ constructor });
    expect(getConstructor(iface)).toBe(constructor);
  });

  test("returns undefined when the interface declares no constructor", () => {
    const iface = makeInterface({ operate: makeOperation({}) });
    expect(getConstructor(iface)).toBeUndefined();
  });
});

describe("validateConstructor", () => {
  test("does not throw", () => {
    expect(() =>
      validateConstructor(makeConstructor({ argumentTypes: [makeLongType()] })),
    ).not.toThrow();
  });
});
