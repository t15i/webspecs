/**
 * @see https://webidl.spec.whatwg.org/#idl-interfaces
 *
 * `validateInterface` checks that an interface is well-formed:
 *   - its identifier is a valid Web IDL identifier;
 *   - every static and instance member upholds its own invariants, via the
 *     member's `validate<MemberType>`; and
 *   - every interface-level invariant contributed by a later chapter (see
 *     `interfaceExtraValidationRules`) holds. The § 2.5.6 rules exercised here
 *     require a getter to accompany a setter/deleter of the same variety, at
 *     most one special operation of each variety, and — when the interface
 *     supports indexed/named properties — the corresponding "supported
 *     property indices/names" behavior (plus an integer-typed `length`
 *     attribute for indexed properties).
 */
import { describe, expect, test } from "vitest";
import {
  IndexedPropertyGetter,
  IndexedPropertySetter,
  NamedPropertyDeleter,
  NamedPropertyGetter,
  NamedPropertySetter,
  SupportedPropertyIndices,
  SupportedPropertyNames,
  validateInterface,
  type IndexedPropertyGetterOperation,
  type IndexedPropertySetterOperation,
  type Interface,
  type NamedPropertyDeleterOperation,
  type NamedPropertyGetterOperation,
  type NamedPropertySetterOperation,
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

function makeNamedGetter(): NamedPropertyGetterOperation {
  return makeOperation({
    keywords: ["getter"],
    argumentTypes: [makeDOMStringType()],
  }) as unknown as NamedPropertyGetterOperation;
}

function makeNamedSetter(): NamedPropertySetterOperation {
  return makeOperation({
    keywords: ["setter"],
    argumentTypes: [makeDOMStringType(), makeLongType()],
  }) as unknown as NamedPropertySetterOperation;
}

function makeNamedDeleter(): NamedPropertyDeleterOperation {
  return makeOperation({
    keywords: ["deleter"],
    argumentTypes: [makeDOMStringType()],
  }) as unknown as NamedPropertyDeleterOperation;
}

function makeIndexedGetter(): IndexedPropertyGetterOperation {
  return makeOperation({
    keywords: ["getter"],
    argumentTypes: [makeUnsignedLongType()],
  }) as unknown as IndexedPropertyGetterOperation;
}

function makeIndexedSetter(): IndexedPropertySetterOperation {
  return makeOperation({
    keywords: ["setter"],
    argumentTypes: [makeUnsignedLongType(), makeLongType()],
  }) as unknown as IndexedPropertySetterOperation;
}

function makeLengthAttribute() {
  return makeAttribute({
    type: makeUnsignedLongType(),
    identifier: "length",
    keywords: ["readonly"],
  });
}

function makeSupportedPropertyIndices(): () => SupportedPropertyIndices {
  return () =>
    ({
      has: () => false,
      *[Symbol.iterator]() {},
    }) as unknown as SupportedPropertyIndices;
}

function makeSupportedPropertyNames(): () => SupportedPropertyNames {
  return () =>
    ({
      has: () => false,
      *[Symbol.iterator]() {},
    }) as unknown as SupportedPropertyNames;
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

  test("propagates special operation validation - combined keywords throw", () => {
    const iface = makeInterface({
      members: {
        // Getter and setter keywords are mutually exclusive.
        [NamedPropertyGetter]: makeOperation({
          keywords: ["getter", "setter"],
          argumentTypes: [makeDOMStringType()],
        }) as unknown as NamedPropertyGetterOperation,
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
        [SupportedPropertyNames]: makeSupportedPropertyNames(),
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
        [SupportedPropertyNames]: makeSupportedPropertyNames(),
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
        [SupportedPropertyIndices]: makeSupportedPropertyIndices(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("does not throw for a named property getter alone", () => {
    const iface = makeInterface({
      members: {
        [NamedPropertyGetter]: makeNamedGetter(),
        [SupportedPropertyNames]: makeSupportedPropertyNames(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

describe("validateInterface - at most one special operation of each variety", () => {
  test("throws when a stray indexed property getter shadows the registered one", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
        [IndexedPropertyGetter]: makeIndexedGetter(),
        [SupportedPropertyIndices]: makeSupportedPropertyIndices(),
        // A second indexed getter declared as an ordinary named member.
        item: makeIndexedGetter(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("throws when a stray named property deleter shadows the registered one", () => {
    const iface = makeInterface({
      members: {
        [NamedPropertyGetter]: makeNamedGetter(),
        [SupportedPropertyNames]: makeSupportedPropertyNames(),
        [NamedPropertyDeleter]: makeNamedDeleter(),
        remove: makeNamedDeleter(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });
});

describe("validateInterface - supported property behaviors", () => {
  test("throws for an indexed property getter without supported property indices", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
        [IndexedPropertyGetter]: makeIndexedGetter(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw for an indexed property getter with supported property indices", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
        [IndexedPropertyGetter]: makeIndexedGetter(),
        [SupportedPropertyIndices]: makeSupportedPropertyIndices(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("throws for a named property getter without supported property names", () => {
    const iface = makeInterface({
      members: { [NamedPropertyGetter]: makeNamedGetter() },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw for a named property getter with supported property names", () => {
    const iface = makeInterface({
      members: {
        [NamedPropertyGetter]: makeNamedGetter(),
        [SupportedPropertyNames]: makeSupportedPropertyNames(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

describe("validateInterface - indexed properties length attribute", () => {
  test("throws for an indexed property getter without a length attribute", () => {
    const iface = makeInterface({
      members: {
        [IndexedPropertyGetter]: makeIndexedGetter(),
        [SupportedPropertyIndices]: makeSupportedPropertyIndices(),
      },
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
        [SupportedPropertyIndices]: makeSupportedPropertyIndices(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("throws when the length member is an operation rather than an attribute", () => {
    const iface = makeInterface({
      members: {
        length: makeOperation({ identifier: "length" }),
        [IndexedPropertyGetter]: makeIndexedGetter(),
        [SupportedPropertyIndices]: makeSupportedPropertyIndices(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not require a length attribute without indexed properties", () => {
    const iface = makeInterface({
      members: {
        [NamedPropertyGetter]: makeNamedGetter(),
        [SupportedPropertyNames]: makeSupportedPropertyNames(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});
