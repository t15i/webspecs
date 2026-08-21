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
  Exposed,
  iterateSpecialOperations,
  validateInterface,
  type IndexedPropertyGetterOperation,
  type IndexedPropertySetterOperation,
  type Interface,
  type InterfaceMembers,
  type NamedPropertyDeleterOperation,
  type NamedPropertyGetterOperation,
  type NamedPropertySetterOperation,
  type SupportedPropertyIndices,
  type SupportedPropertyNames,
} from "lib/webidl";

import {
  makeAttribute,
  makeConstructor,
  makeOperation,
} from "../05-idl-members/utils";
import {
  makeDOMStringType,
  makeLongType,
  makeUnsignedLongType,
} from "../13-idl-types/utils";

/**
 * § 2.5.6: declaring a special operation with an identifier "is equivalent to
 * separating the special operation out into its own declaration without an
 * identifier", so an interface that names one declares it twice — in the field
 * of its variety and as a member under that identifier. The second declaration
 * is made here, so that a test naming a special operation gets a well-formed
 * interface without restating it.
 */
function makeInterface(overrides: Partial<Interface> = {}): Interface {
  const iface: Interface = {
    identifier: "Example",
    extendedAttributes: { [Exposed]: "*" },
    inherit: null,
    staticMembers: {},
    behaviors: {},
    members: {},
    ...overrides,
  };

  const members: InterfaceMembers = { ...iface.members };

  for (const operation of iterateSpecialOperations(iface)) {
    if (operation.identifier !== undefined) {
      members[operation.identifier] = [operation];
    }
  }

  return { ...iface, members };
}

function makeNamedGetter(): NamedPropertyGetterOperation {
  return makeOperation({
    identifier: "namedItem",
    keywords: ["getter"],
    argumentTypes: [makeDOMStringType()],
  }) as NamedPropertyGetterOperation;
}

function makeNamedSetter(): NamedPropertySetterOperation {
  return makeOperation({
    identifier: "setNamedItem",
    keywords: ["setter"],
    argumentTypes: [makeDOMStringType(), makeLongType()],
  }) as NamedPropertySetterOperation;
}

function makeNamedDeleter(): NamedPropertyDeleterOperation {
  return makeOperation({
    identifier: "removeNamedItem",
    keywords: ["deleter"],
    argumentTypes: [makeDOMStringType()],
  }) as NamedPropertyDeleterOperation;
}

function makeIndexedGetter(): IndexedPropertyGetterOperation {
  return makeOperation({
    identifier: "item",
    keywords: ["getter"],
    argumentTypes: [makeUnsignedLongType()],
  }) as IndexedPropertyGetterOperation;
}

function makeIndexedSetter(): IndexedPropertySetterOperation {
  return makeOperation({
    identifier: "setItem",
    keywords: ["setter"],
    argumentTypes: [makeUnsignedLongType(), makeLongType()],
  }) as IndexedPropertySetterOperation;
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
    }) as SupportedPropertyIndices;
}

function makeSupportedPropertyNames(): () => SupportedPropertyNames {
  return () =>
    ({
      has: () => false,
      *[Symbol.iterator]() {},
    }) as SupportedPropertyNames;
}

function makeUnnamedIndexedGetter(): IndexedPropertyGetterOperation {
  return makeOperation({
    identifier: undefined,
    keywords: ["getter"],
    argumentTypes: [makeUnsignedLongType()],
  }) as IndexedPropertyGetterOperation;
}

function makeUnnamedIndexedSetter(): IndexedPropertySetterOperation {
  return makeOperation({
    identifier: undefined,
    keywords: ["setter"],
    argumentTypes: [makeUnsignedLongType(), makeLongType()],
  }) as IndexedPropertySetterOperation;
}

function makeUnnamedNamedGetter(): NamedPropertyGetterOperation {
  return makeOperation({
    identifier: undefined,
    keywords: ["getter"],
    argumentTypes: [makeDOMStringType()],
  }) as NamedPropertyGetterOperation;
}

function makeUnnamedNamedSetter(): NamedPropertySetterOperation {
  return makeOperation({
    identifier: undefined,
    keywords: ["setter"],
    argumentTypes: [makeDOMStringType(), makeLongType()],
  }) as NamedPropertySetterOperation;
}

function makeUnnamedNamedDeleter(): NamedPropertyDeleterOperation {
  return makeOperation({
    identifier: undefined,
    keywords: ["deleter"],
    argumentTypes: [makeDOMStringType()],
  }) as NamedPropertyDeleterOperation;
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
        operate: [makeOperation({ argumentTypes: [] })],
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
      members: { operate: [makeOperation({ identifier: "1bad" })] },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("propagates special operation validation - combined keywords throw", () => {
    const iface = makeInterface({
      // Getter and setter keywords are mutually exclusive.
      namedPropertyGetter: makeOperation({
        keywords: ["getter", "setter"],
        argumentTypes: [makeDOMStringType()],
      }) as NamedPropertyGetterOperation,
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

describe("validateInterface - static members require the static keyword", () => {
  test("throws for a static member declared without the static keyword", () => {
    const iface = makeInterface({
      staticMembers: {
        make: [makeOperation({ identifier: "make" })],
      },
    });

    expect(() => validateInterface(iface)).toThrow(/static/i);
  });

  test("does not throw for a static operation declared with the static keyword", () => {
    const iface = makeInterface({
      staticMembers: {
        make: [makeOperation({ identifier: "make", keywords: ["static"] })],
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

describe("validateInterface - constructor operations", () => {
  test("does not throw for an interface with a valid constructor operation", () => {
    // A constructor operation is a legal member; an interface that declares one
    // must validate. It has neither an identifier nor a return type, so what is
    // checked of it is its argument list.
    const iface = makeInterface({
      members: {
        constructor: [makeConstructor({ argumentTypes: [makeLongType()] })],
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("throws for a constructor operation with an invalid argument list", () => {
    const iface = makeInterface({
      members: {
        constructor: [
          makeConstructor({
            arguments: [
              { type: makeLongType(), identifier: "x" },
              { type: makeLongType(), identifier: "x" },
            ],
          }),
        ],
      },
    });

    expect(() => validateInterface(iface)).toThrow(/declared twice/i);
  });

  test("throws for a constructor argument with a default value but no optional keyword", () => {
    const iface = makeInterface({
      members: {
        constructor: [
          makeConstructor({
            arguments: [
              { type: makeLongType(), identifier: "x", defaultValue: 0 },
            ],
          }),
        ],
      },
    });

    expect(() => validateInterface(iface)).toThrow(/optional/i);
  });

  test("does not throw for a constructor with an optional argument", () => {
    const iface = makeInterface({
      members: {
        constructor: [
          makeConstructor({
            arguments: [
              { type: makeLongType(), identifier: "width" },
              {
                type: makeLongType(),
                identifier: "height",
                keywords: ["optional"],
                defaultValue: 0,
              },
            ],
          }),
        ],
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("still validates the interface's other members alongside a constructor", () => {
    const iface = makeInterface({
      members: {
        constructor: [makeConstructor({})],
        attr: makeAttribute({ type: makeDOMStringType(), identifier: "1bad" }),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });
});

describe("validateInterface - special operation getter requirements", () => {
  test("throws for a named property deleter without a named property getter", () => {
    const iface = makeInterface({
      namedPropertyDeleter: makeNamedDeleter(),
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw for a named property deleter with a named property getter", () => {
    const iface = makeInterface({
      namedPropertyGetter: makeNamedGetter(),
      namedPropertyDeleter: makeNamedDeleter(),
      behaviors: {
        supportedPropertyNames: makeSupportedPropertyNames(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("throws for a named property setter without a named property getter", () => {
    const iface = makeInterface({
      namedPropertySetter: makeNamedSetter(),
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw for a named property setter with a named property getter", () => {
    const iface = makeInterface({
      namedPropertyGetter: makeNamedGetter(),
      namedPropertySetter: makeNamedSetter(),
      behaviors: {
        supportedPropertyNames: makeSupportedPropertyNames(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("throws for an indexed property setter without an indexed property getter", () => {
    const iface = makeInterface({
      indexedPropertySetter: makeIndexedSetter(),
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw for an indexed property setter with an indexed property getter", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
      },
      indexedPropertyGetter: makeIndexedGetter(),
      indexedPropertySetter: makeIndexedSetter(),
      behaviors: {
        supportedPropertyIndices: makeSupportedPropertyIndices(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("does not throw for a named property getter alone", () => {
    const iface = makeInterface({
      namedPropertyGetter: makeNamedGetter(),
      behaviors: {
        supportedPropertyNames: makeSupportedPropertyNames(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#dfn-special-operation
 *
 * An interface defines a special operation in the field of its variety rather
 * than under a key of the member table, because the canonical declaration of
 * one carries no identifier to be keyed by. It is a member all the same, held
 * to the invariants of § 2.5.6 and to the ones every operation must uphold.
 */
describe("validateInterface - the special operations an interface defines", () => {
  function makeIndexedInterface(
    getter: IndexedPropertyGetterOperation,
  ): Interface {
    return makeInterface({
      members: {
        length: makeLengthAttribute(),
      },
      indexedPropertyGetter: getter,
      behaviors: {
        supportedPropertyIndices: makeSupportedPropertyIndices(),
        indexedPropertyDeterminator: () => undefined,
      },
    });
  }

  test("does not throw for a well-formed one", () => {
    expect(() =>
      validateInterface(makeIndexedInterface(makeUnnamedIndexedGetter())),
    ).not.toThrow();
  });

  test("rejects one that combines the keywords of two varieties", () => {
    // § 2.5.6 gives each declaration one variety; "getter setter" matches none.
    const getter = makeOperation({
      identifier: undefined,
      keywords: ["getter", "setter"],
      argumentTypes: [makeUnsignedLongType()],
    }) as IndexedPropertyGetterOperation;

    expect(() => validateInterface(makeIndexedInterface(getter))).toThrow(
      /must not combine/i,
    );
  });

  test("rejects one declared static", () => {
    const getter = makeOperation({
      identifier: undefined,
      keywords: ["getter", "static"],
      argumentTypes: [makeUnsignedLongType()],
    }) as IndexedPropertyGetterOperation;

    expect(() => validateInterface(makeIndexedInterface(getter))).toThrow(
      /must not be static/i,
    );
  });

  test("rejects an argument list that declares an identifier twice", () => {
    const getter = makeOperation({
      identifier: undefined,
      keywords: ["getter"],
      arguments: [
        { type: makeUnsignedLongType(), identifier: "index" },
        { type: makeUnsignedLongType(), identifier: "index" },
      ],
    }) as IndexedPropertyGetterOperation;

    expect(() => validateInterface(makeIndexedInterface(getter))).toThrow(
      /declared twice/i,
    );
  });

  test("rejects an argument declared with a default value but not optional", () => {
    const getter = makeOperation({
      identifier: undefined,
      keywords: ["getter"],
      arguments: [
        { type: makeUnsignedLongType(), identifier: "index", defaultValue: 0 },
      ],
    }) as IndexedPropertyGetterOperation;

    expect(() => validateInterface(makeIndexedInterface(getter))).toThrow(
      /can be declared with a default value/i,
    );
  });

  test("rejects a named property getter that does not take a DOMString", () => {
    const iface = makeInterface({
      namedPropertyGetter: makeOperation({
        identifier: undefined,
        keywords: ["getter"],
        argumentTypes: [makeLongType()],
      }) as NamedPropertyGetterOperation,
      behaviors: {
        supportedPropertyNames: makeSupportedPropertyNames(),
        namedPropertyDeterminator: () => undefined,
      },
    });

    expect(() => validateInterface(iface)).toThrow(/single "DOMString"/);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#idl-special-operations
 *
 * § 2.5.6: declaring a special operation with an identifier "is equivalent to
 * separating the special operation out into its own declaration without an
 * identifier". Both halves of that equivalence are kept, so an interface that
 * names a special operation must also declare it as a member under that name —
 * which is what gives it a property of its own. These interfaces are built by
 * hand, because the `makeInterface` helper supplies the second declaration.
 */
describe("validateInterface - a named special operation is a member too", () => {
  function makeRawInterface(overrides: Partial<Interface>): Interface {
    return {
      identifier: "Example",
      extendedAttributes: { [Exposed]: "*" },
      inherit: null,
      staticMembers: {},
      behaviors: {
        supportedPropertyNames: makeSupportedPropertyNames(),
      },
      members: {},
      ...overrides,
    };
  }

  test("does not throw when it is declared under its identifier", () => {
    const getter = makeNamedGetter();

    expect(() =>
      validateInterface(
        makeRawInterface({
          members: { namedItem: [getter] },
          namedPropertyGetter: getter,
        }),
      ),
    ).not.toThrow();
  });

  test("throws when it is not declared as a member at all", () => {
    expect(() =>
      validateInterface(
        makeRawInterface({ namedPropertyGetter: makeNamedGetter() }),
      ),
    ).toThrow(/must also be a member under it/);
  });

  test("throws when the member under that identifier is a different operation", () => {
    expect(() =>
      validateInterface(
        makeRawInterface({
          members: { namedItem: [makeOperation({ identifier: "namedItem" })] },
          namedPropertyGetter: makeNamedGetter(),
        }),
      ),
    ).toThrow(/must also be a member under it/);
  });

  test("throws when the member under that identifier is an attribute", () => {
    expect(() =>
      validateInterface(
        makeRawInterface({
          members: {
            namedItem: makeAttribute({
              type: makeDOMStringType(),
              identifier: "namedItem",
            }),
          },
          namedPropertyGetter: makeNamedGetter(),
        }),
      ),
    ).toThrow(/must also be a member under it/);
  });

  test("does not throw when it is declared among overloads under that identifier", () => {
    const getter = makeNamedGetter();

    expect(() =>
      validateInterface(
        makeRawInterface({
          members: {
            namedItem: [
              getter,
              makeOperation({
                identifier: "namedItem",
                argumentTypes: [makeLongType()],
              }),
            ],
          },
          namedPropertyGetter: getter,
        }),
      ),
    ).not.toThrow();
  });

  test("says nothing about one declared without an identifier", () => {
    expect(() =>
      validateInterface(
        makeRawInterface({
          namedPropertyGetter: makeUnnamedNamedGetter(),
          behaviors: {
            supportedPropertyNames: makeSupportedPropertyNames(),
            namedPropertyDeterminator: () => undefined,
          },
        }),
      ),
    ).not.toThrow();
  });
});

describe("validateInterface - at most one special operation of each variety", () => {
  const makeStrayIndexedGetter = () =>
    makeOperation({
      identifier: "at",
      keywords: ["getter"],
      argumentTypes: [makeUnsignedLongType()],
    });

  test("throws when a stray indexed property getter shadows the defined one", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
        // A second indexed getter declared as an ordinary named member.
        at: [makeStrayIndexedGetter()],
      },
      indexedPropertyGetter: makeIndexedGetter(),
      behaviors: {
        supportedPropertyIndices: makeSupportedPropertyIndices(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(/not the one the interface/);
  });

  test("finds a stray special operation hidden among overloads", () => {
    // A slot holding overloads must be searched through: a special operation
    // declared as one of them is just as stray as a lone one.
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
        at: [makeOperation({ identifier: "at" }), makeStrayIndexedGetter()],
      },
      indexedPropertyGetter: makeIndexedGetter(),
      behaviors: {
        supportedPropertyIndices: makeSupportedPropertyIndices(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(/not the one the interface/);
  });

  test("throws when a stray named property deleter shadows the defined one", () => {
    const iface = makeInterface({
      members: {
        remove: [
          makeOperation({
            identifier: "remove",
            keywords: ["deleter"],
            argumentTypes: [makeDOMStringType()],
          }),
        ],
      },
      namedPropertyGetter: makeNamedGetter(),
      namedPropertyDeleter: makeNamedDeleter(),
      behaviors: {
        supportedPropertyNames: makeSupportedPropertyNames(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(/not the one the interface/);
  });
});

describe("validateInterface - supported property behaviors", () => {
  test("throws for an indexed property getter without supported property indices", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
      },
      indexedPropertyGetter: makeIndexedGetter(),
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw for an indexed property getter with supported property indices", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
      },
      indexedPropertyGetter: makeIndexedGetter(),
      behaviors: {
        supportedPropertyIndices: makeSupportedPropertyIndices(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("throws for a named property getter without supported property names", () => {
    const iface = makeInterface({
      namedPropertyGetter: makeNamedGetter(),
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw for a named property getter with supported property names", () => {
    const iface = makeInterface({
      namedPropertyGetter: makeNamedGetter(),
      behaviors: {
        supportedPropertyNames: makeSupportedPropertyNames(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

describe("validateInterface - indexed properties length attribute", () => {
  test("throws for an indexed property getter without a length attribute", () => {
    const iface = makeInterface({
      indexedPropertyGetter: makeIndexedGetter(),
      behaviors: {
        supportedPropertyIndices: makeSupportedPropertyIndices(),
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
      },
      indexedPropertyGetter: makeIndexedGetter(),
      behaviors: {
        supportedPropertyIndices: makeSupportedPropertyIndices(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("throws when the length member is an operation rather than an attribute", () => {
    const iface = makeInterface({
      members: {
        length: [makeOperation({ identifier: "length" })],
      },
      indexedPropertyGetter: makeIndexedGetter(),
      behaviors: {
        supportedPropertyIndices: makeSupportedPropertyIndices(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not require a length attribute without indexed properties", () => {
    const iface = makeInterface({
      namedPropertyGetter: makeNamedGetter(),
      behaviors: {
        supportedPropertyNames: makeSupportedPropertyNames(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

describe("validateInterface - unnamed indexed property getter", () => {
  test("throws without steps to determine the value of an indexed property", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
      },
      indexedPropertyGetter: makeUnnamedIndexedGetter(),
      behaviors: {
        supportedPropertyIndices: makeSupportedPropertyIndices(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw once those steps are provided", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
      },
      indexedPropertyGetter: makeUnnamedIndexedGetter(),
      behaviors: {
        supportedPropertyIndices: makeSupportedPropertyIndices(),
        indexedPropertyDeterminator: () => undefined,
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("does not require those steps when the getter is named", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
      },
      indexedPropertyGetter: makeIndexedGetter(),
      behaviors: {
        supportedPropertyIndices: makeSupportedPropertyIndices(),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

describe("validateInterface - unnamed indexed property setter", () => {
  test("throws without steps to set new and existing indexed properties", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
      },
      indexedPropertyGetter: makeIndexedGetter(),
      indexedPropertySetter: makeUnnamedIndexedSetter(),
      behaviors: {
        supportedPropertyIndices: makeSupportedPropertyIndices(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("throws when only the new-property steps are present", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
      },
      indexedPropertyGetter: makeIndexedGetter(),
      indexedPropertySetter: makeUnnamedIndexedSetter(),
      behaviors: {
        supportedPropertyIndices: makeSupportedPropertyIndices(),
        newIndexedPropertySetter: () => undefined,
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw once both new and existing steps are provided", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
      },
      indexedPropertyGetter: makeIndexedGetter(),
      indexedPropertySetter: makeUnnamedIndexedSetter(),
      behaviors: {
        supportedPropertyIndices: makeSupportedPropertyIndices(),
        newIndexedPropertySetter: () => undefined,
        existingIndexedPropertySetter: () => undefined,
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

describe("validateInterface - unnamed named property getter", () => {
  test("throws without steps to determine the value of a named property", () => {
    const iface = makeInterface({
      namedPropertyGetter: makeUnnamedNamedGetter(),
      behaviors: {
        supportedPropertyNames: makeSupportedPropertyNames(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw once those steps are provided", () => {
    const iface = makeInterface({
      namedPropertyGetter: makeUnnamedNamedGetter(),
      behaviors: {
        supportedPropertyNames: makeSupportedPropertyNames(),
        namedPropertyDeterminator: () => undefined,
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

describe("validateInterface - unnamed named property setter", () => {
  test("throws without steps to set new and existing named properties", () => {
    const iface = makeInterface({
      namedPropertyGetter: makeNamedGetter(),
      namedPropertySetter: makeUnnamedNamedSetter(),
      behaviors: {
        supportedPropertyNames: makeSupportedPropertyNames(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw once both new and existing steps are provided", () => {
    const iface = makeInterface({
      namedPropertyGetter: makeNamedGetter(),
      namedPropertySetter: makeUnnamedNamedSetter(),
      behaviors: {
        supportedPropertyNames: makeSupportedPropertyNames(),
        newNamedPropertySetter: () => undefined,
        existingNamedPropertySetter: () => undefined,
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

describe("validateInterface - unnamed named property deleter", () => {
  test("throws without steps to delete an existing named property", () => {
    const iface = makeInterface({
      namedPropertyGetter: makeNamedGetter(),
      namedPropertyDeleter: makeUnnamedNamedDeleter(),
      behaviors: {
        supportedPropertyNames: makeSupportedPropertyNames(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw once those steps are provided", () => {
    const iface = makeInterface({
      namedPropertyGetter: makeNamedGetter(),
      namedPropertyDeleter: makeUnnamedNamedDeleter(),
      behaviors: {
        supportedPropertyNames: makeSupportedPropertyNames(),
        existingNamedPropertyDeleter: () => undefined,
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

describe("validateInterface - overloaded members", () => {
  test("does not throw for a valid set of overloads", () => {
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

  test("validates every overload, not just the first", () => {
    const iface = makeInterface({
      members: {
        f: [
          makeOperation({ identifier: "f", argumentTypes: [makeLongType()] }),
          makeOperation({
            identifier: "f",
            arguments: [
              { type: makeLongType(), identifier: "x" },
              { type: makeLongType(), identifier: "x" },
            ],
          }),
        ],
      },
    });

    expect(() => validateInterface(iface)).toThrow(/declared twice/i);
  });

  test("requires the static keyword on every overload of a static member", () => {
    const iface = makeInterface({
      staticMembers: {
        make: [
          makeOperation({ identifier: "make", keywords: ["static"] }),
          makeOperation({ identifier: "make" }),
        ],
      },
    });

    expect(() => validateInterface(iface)).toThrow(/"static" keyword/);
  });

  test("throws for a slot holding no members at all", () => {
    const iface = makeInterface({ members: { f: [] } });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });
});
