/**
 * @see https://webidl.spec.whatwg.org/#idl-interfaces
 *
 * `validateInterface` checks that an interface is well-formed:
 *   - its identifier is a valid Web IDL identifier;
 *   - every static and instance member upholds its own invariants, via the
 *     member's `validate<MemberType>`; and
 *   - every interface-level invariant contributed by a later chapter (see
 *     `interfaceExtraValidationRules`) holds. The § 2.5.6 rules exercised
 *     here require a special operation getter to accompany a setter of the
 *     same variety, and a named property getter to accompany a named
 *     property deleter.
 */
import { describe, expect, test } from "vitest";
import {
  IndexedPropertyGetter,
  IndexedPropertySetter,
  NamedPropertyDeleter,
  NamedPropertyGetter,
  NamedPropertySetter,
  validateInterface,
  type Interface,
} from "lib/webidl";

import { makeAttribute, makeOperation } from "../05-idl-members/utils";
import {
  makeDOMStringType,
  makeLongType,
  makeUnsignedLongType,
} from "../13-idl-types/utils";

function makeInterface(overrides: Partial<Interface> = {}): Interface {
  return {
    identifier: "Example",
    extendedAttributes: {},
    staticMembers: {},
    members: {},
    ...overrides,
  };
}

function makeNamedGetter(): NamedPropertyGetter {
  return makeOperation({
    keywords: ["getter"],
    argumentTypes: [makeDOMStringType()],
  }) as NamedPropertyGetter;
}

function makeNamedSetter(): NamedPropertySetter {
  return makeOperation({
    keywords: ["setter"],
    argumentTypes: [makeDOMStringType(), makeLongType()],
  }) as NamedPropertySetter;
}

function makeNamedDeleter(): NamedPropertyDeleter {
  return makeOperation({
    keywords: ["deleter"],
    argumentTypes: [makeDOMStringType()],
  }) as NamedPropertyDeleter;
}

function makeIndexedGetter(): IndexedPropertyGetter {
  return makeOperation({
    keywords: ["getter"],
    argumentTypes: [makeUnsignedLongType()],
  }) as IndexedPropertyGetter;
}

function makeIndexedSetter(): IndexedPropertySetter {
  return makeOperation({
    keywords: ["setter"],
    argumentTypes: [makeUnsignedLongType(), makeLongType()],
  }) as IndexedPropertySetter;
}

function makeLengthAttribute() {
  return makeAttribute({
    type: makeUnsignedLongType(),
    identifier: "length",
    keywords: ["readonly"],
  });
}

describe("validateInterface - identifier", () => {
  test("does not throw for an interface with a valid identifier", () => {
    expect(() => validateInterface(makeInterface())).not.toThrow();
  });

  test("throws TypeError for an invalid identifier", () => {
    expect(() =>
      validateInterface(makeInterface({ identifier: "1Bad" })),
    ).toThrow(TypeError);
  });
});

describe("validateInterface - members", () => {
  test("does not throw for valid attribute and operation members", () => {
    const iface = makeInterface({
      members: {
        attr: makeAttribute({ type: makeDOMStringType() }),
        operate: makeOperation({ argumentTypes: [] }),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("propagates attribute validation - invalid identifier throws", () => {
    const iface = makeInterface({
      members: {
        attr: makeAttribute({ type: makeDOMStringType(), identifier: "1bad" }),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("propagates operation validation - invalid identifier throws", () => {
    const iface = makeInterface({
      members: { operate: makeOperation({ identifier: "1bad" }) },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("propagates special operation validation - malformed getter throws", () => {
    const iface = makeInterface({
      members: {
        // A named getter must take a single argument.
        [NamedPropertyGetter]: makeOperation({
          keywords: ["getter"],
          argumentTypes: [makeDOMStringType(), makeDOMStringType()],
        }) as NamedPropertyGetter,
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("validates static members too", () => {
    const iface = makeInterface({
      staticMembers: {
        prototype: makeAttribute({
          type: makeDOMStringType(),
          identifier: "prototype",
          keywords: ["static"],
        }),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });
});

describe("validateInterface - special operation getter requirements", () => {
  test("throws for a named property deleter without a named property getter", () => {
    const iface = makeInterface({
      members: { [NamedPropertyDeleter]: makeNamedDeleter() },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw for a named property deleter with a named property getter", () => {
    const iface = makeInterface({
      members: {
        [NamedPropertyGetter]: makeNamedGetter(),
        [NamedPropertyDeleter]: makeNamedDeleter(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("throws for a named property setter without a named property getter", () => {
    const iface = makeInterface({
      members: { [NamedPropertySetter]: makeNamedSetter() },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw for a named property setter with a named property getter", () => {
    const iface = makeInterface({
      members: {
        [NamedPropertyGetter]: makeNamedGetter(),
        [NamedPropertySetter]: makeNamedSetter(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("throws for an indexed property setter without an indexed property getter", () => {
    const iface = makeInterface({
      members: { [IndexedPropertySetter]: makeIndexedSetter() },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw for an indexed property setter with an indexed property getter", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
        [IndexedPropertyGetter]: makeIndexedGetter(),
        [IndexedPropertySetter]: makeIndexedSetter(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("does not throw for a named property getter alone", () => {
    const iface = makeInterface({
      members: { [NamedPropertyGetter]: makeNamedGetter() },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

describe("validateInterface - indexed properties length attribute", () => {
  test("does not throw for an indexed property getter with an integer-typed length attribute", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
        [IndexedPropertyGetter]: makeIndexedGetter(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("throws for an indexed property getter without a length attribute", () => {
    const iface = makeInterface({
      members: { [IndexedPropertyGetter]: makeIndexedGetter() },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("throws when the length member is not an integer-typed attribute", () => {
    const iface = makeInterface({
      members: {
        length: makeAttribute({
          type: makeDOMStringType(),
          identifier: "length",
        }),
        [IndexedPropertyGetter]: makeIndexedGetter(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("throws when the length member is an operation rather than an attribute", () => {
    const iface = makeInterface({
      members: {
        length: makeOperation({ identifier: "length" }),
        [IndexedPropertyGetter]: makeIndexedGetter(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not require a length attribute without indexed properties", () => {
    const iface = makeInterface({
      members: { [NamedPropertyGetter]: makeNamedGetter() },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});
