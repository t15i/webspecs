/**
 * @see https://webidl.spec.whatwg.org/#idl-overloading
 *
 * The restrictions § 2.5.8 places on a set of overloaded operations, checked
 * through `validateInterface` because they are stated over the whole interface:
 * the overloads must agree on whether they return a promise; the items of the
 * effective overload set that share a type list size must have a distinguishing
 * argument index; the arguments before that index must match across them; and a
 * bigint argument must not sit opposite a numeric one at that index.
 */
import { describe, expect, test } from "vitest";
import { Exposed, validateInterface, type Interface } from "lib/webidl";

import { makeAttribute, makeConstructor, makeOperation } from "../utils";
import {
  makeBigIntType,
  makeDOMStringType,
  makeDoubleType,
  makeInterfaceType,
  makeLongType,
  makeNullableType,
  makePromiseType,
  makeUSVStringType,
} from "../../13-idl-types/utils";

function makeInterface(overrides: Partial<Interface> = {}): Interface {
  return {
    identifier: "Example",
    extendedAttributes: { [Exposed]: "*" },
    inherit: null,
    staticMembers: {},
    members: {},
    ...overrides,
  };
}

class Node {}
class Event {}

describe("validateInterface - distinguishable overloads", () => {
  test("does not throw when the overloads are distinguishable", () => {
    // The § 2.5.8 example, minus its variadic arguments: Node and Event are
    // distinguishable, so index 0 distinguishes the two-argument items.
    const iface = makeInterface({
      members: {
        f: [
          makeOperation({
            identifier: "f",
            argumentTypes: [makeDOMStringType()],
          }),
          makeOperation({
            identifier: "f",
            argumentTypes: [makeInterfaceType(Node), makeDOMStringType()],
          }),
          makeOperation({ identifier: "f", argumentTypes: [] }),
          makeOperation({
            identifier: "f",
            argumentTypes: [makeInterfaceType(Event), makeDOMStringType()],
          }),
        ],
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("throws when two overloads of one size are not distinguishable", () => {
    // The spec's own invalid example: DOMString and USVString are both string
    // types, so no index tells the two apart.
    const iface = makeInterface({
      members: {
        f: [
          makeOperation({
            identifier: "f",
            argumentTypes: [makeDOMStringType()],
          }),
          makeOperation({
            identifier: "f",
            argumentTypes: [makeUSVStringType()],
          }),
        ],
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("throws when the arguments before the distinguishing index differ", () => {
    // The spec's second invalid example: for type list size 4 the
    // distinguishing argument index is 2, but index 0 holds long in one
    // overload and double in the other.
    const iface = makeInterface({
      members: {
        f: [
          makeOperation({
            identifier: "f",
            argumentTypes: [
              makeLongType(),
              makeDoubleType(),
              makeInterfaceType(Node),
              makeInterfaceType(Node),
            ],
          }),
          makeOperation({
            identifier: "f",
            argumentTypes: [
              makeDoubleType(),
              makeDoubleType(),
              makeDOMStringType(),
              makeInterfaceType(Node),
            ],
          }),
        ],
      },
    });

    expect(() => validateInterface(iface)).toThrow(/index 0/);
  });

  test("does not throw when the arguments before the distinguishing index match", () => {
    // One IDL type is one object, so the shared `long` satisfies "the same" at
    // index 0, and index 1 does the distinguishing.
    const long = makeLongType();
    const iface = makeInterface({
      members: {
        f: [
          makeOperation({
            identifier: "f",
            argumentTypes: [long, makeInterfaceType(Node)],
          }),
          makeOperation({
            identifier: "f",
            argumentTypes: [long, makeDOMStringType()],
          }),
        ],
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("throws when a nullable type faces its non-nullable form before the distinguishing index", () => {
    // `long?` and `long` are not distinguishable - the fourth step of the
    // distinguishability algorithm strips the nullable wrapper - so they can
    // only ever sit before the distinguishing index, where they are caught for
    // being different types: null would convert to null under one overload and
    // to 0 under the other.
    const long = makeLongType();
    const iface = makeInterface({
      members: {
        f: [
          makeOperation({
            identifier: "f",
            argumentTypes: [makeNullableType(long), makeInterfaceType(Node)],
          }),
          makeOperation({
            identifier: "f",
            argumentTypes: [long, makeDOMStringType()],
          }),
        ],
      },
    });

    expect(() => validateInterface(iface)).toThrow(/index 0/);
  });

  test("throws when the optionality values before the distinguishing index differ", () => {
    const long = makeLongType();
    const iface = makeInterface({
      members: {
        f: [
          makeOperation({
            identifier: "f",
            arguments: [
              { type: long, identifier: "a" },
              { type: makeInterfaceType(Node), identifier: "b" },
            ],
          }),
          makeOperation({
            identifier: "f",
            arguments: [
              { type: long, identifier: "a", keywords: ["optional"] },
              { type: makeDOMStringType(), identifier: "b" },
            ],
          }),
        ],
      },
    });

    expect(() => validateInterface(iface)).toThrow(/optionality values/);
  });

  test("applies to overloaded static operations as well", () => {
    const iface = makeInterface({
      staticMembers: {
        make: [
          makeOperation({
            identifier: "make",
            keywords: ["static"],
            argumentTypes: [makeDOMStringType()],
          }),
          makeOperation({
            identifier: "make",
            keywords: ["static"],
            argumentTypes: [makeUSVStringType()],
          }),
        ],
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("applies to overloaded constructor operations as well", () => {
    const iface = makeInterface({
      members: {
        constructor: [
          makeConstructor({ argumentTypes: [makeDOMStringType()] }),
          makeConstructor({ argumentTypes: [makeUSVStringType()] }),
        ],
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });
});

describe("validateInterface - bigint against numeric overloading", () => {
  test("throws when one overload takes bigint and another a numeric type", () => {
    const iface = makeInterface({
      members: {
        f: [
          makeOperation({ identifier: "f", argumentTypes: [makeBigIntType()] }),
          makeOperation({ identifier: "f", argumentTypes: [makeLongType()] }),
        ],
      },
    });

    expect(() => validateInterface(iface)).toThrow(/bigint/);
  });

  test("does not throw for bigint against a string type", () => {
    const iface = makeInterface({
      members: {
        f: [
          makeOperation({ identifier: "f", argumentTypes: [makeBigIntType()] }),
          makeOperation({
            identifier: "f",
            argumentTypes: [makeDOMStringType()],
          }),
        ],
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

describe("validateInterface - promise-returning overloads", () => {
  test("does not throw when no overload returns a promise", () => {
    const iface = makeInterface({
      members: {
        f: [
          makeOperation({ identifier: "f", argumentTypes: [makeLongType()] }),
          makeOperation({ identifier: "f", argumentTypes: [] }),
        ],
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("does not throw when every overload returns a promise", () => {
    const iface = makeInterface({
      members: {
        f: [
          makeOperation({
            identifier: "f",
            argumentTypes: [makeLongType()],
            returnType: makePromiseType(makeLongType()),
          }),
          makeOperation({
            identifier: "f",
            argumentTypes: [],
            returnType: makePromiseType(makeLongType()),
          }),
        ],
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("throws when only some overloads return a promise", () => {
    const iface = makeInterface({
      members: {
        f: [
          makeOperation({
            identifier: "f",
            argumentTypes: [makeLongType()],
            returnType: makePromiseType(makeLongType()),
          }),
          makeOperation({ identifier: "f", argumentTypes: [] }),
        ],
      },
    });

    expect(() => validateInterface(iface)).toThrow(/promise/i);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#idl-overloading
 *
 * The rules are about operations overloaded under an identifier, so the slots
 * that hold anything else are passed over: the symbol-keyed slots that carry
 * the machinery of special operations, and the members of another kind.
 */
describe("validateInterface - slots that are not overloaded operations", () => {
  test("passes over a symbol-keyed slot", () => {
    const marker = Symbol("marker");
    const iface = makeInterface({
      members: {
        [marker]: () => undefined,
        f: [
          makeOperation({ identifier: "f", argumentTypes: [makeLongType()] }),
          makeOperation({ identifier: "f", argumentTypes: [] }),
        ],
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("passes over an attribute", () => {
    const iface = makeInterface({
      members: {
        attr: makeAttribute({ type: makeLongType(), identifier: "attr" }),
      },
      staticMembers: {
        stat: makeAttribute({
          type: makeLongType(),
          identifier: "stat",
          keywords: ["static"],
        }),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});
