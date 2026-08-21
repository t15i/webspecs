/**
 * @see https://webidl.spec.whatwg.org/#idl-constructors
 *
 * A constructor operation is recognised by its `kind`. An interface "was
 * declared with a constructor operation" exactly when its `constructor` member
 * is a constructor operation; `getOwnConstructorOperation` resolves that own
 * member and, crucially, must not confuse it with the inherited
 * `Object.prototype.constructor`.
 */
import { describe, expect, test } from "vitest";
import {
  Exposed,
  getOwnConstructorOperations,
  isConstructorOperation,
  type Interface,
} from "lib/webidl";

import { makeConstructor, makeAttribute, makeOperation } from "../utils";
import { makeDOMStringType, makeLongType } from "../../13-idl-types/utils";

function makeInterface(members: Interface["members"] = {}): Interface {
  return {
    identifier: "Example",
    extendedAttributes: { [Exposed]: "*" },
    inherit: null,
    members,
    staticMembers: {},
  };
}

describe("isConstructorOperation", () => {
  test("returns true for a constructor member", () => {
    expect(isConstructorOperation(makeConstructor({}))).toBe(true);
  });

  test("returns false for an operation member", () => {
    expect(isConstructorOperation(makeOperation({}))).toBe(false);
  });

  test("returns false for an attribute member", () => {
    expect(
      isConstructorOperation(makeAttribute({ type: makeDOMStringType() })),
    ).toBe(false);
  });
});

describe("getOwnConstructorOperations", () => {
  test("returns the constructor when the interface declares one", () => {
    const constructor = makeConstructor({ argumentTypes: [makeLongType()] });
    const iface = makeInterface({ constructor });
    expect(getOwnConstructorOperations(iface)).toEqual([constructor]);
  });

  test("returns every overload when the constructor is overloaded", () => {
    const one = makeConstructor({ argumentTypes: [makeLongType()] });
    const two = makeConstructor({ argumentTypes: [makeDOMStringType()] });
    const iface = makeInterface({ constructor: [one, two] });
    expect(getOwnConstructorOperations(iface)).toEqual([one, two]);
  });

  test("returns an empty list when the interface declares no constructor", () => {
    const iface = makeInterface({ operate: makeOperation({}) });
    expect(getOwnConstructorOperations(iface)).toEqual([]);
  });

  test("returns an empty list for an interface with no members at all", () => {
    // The lookup must not resolve up the prototype chain to the inherited
    // `Object.prototype.constructor`; an interface with no own constructor key
    // reports no constructor.
    expect(getOwnConstructorOperations(makeInterface())).toEqual([]);
  });
});
