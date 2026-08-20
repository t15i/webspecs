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
  ExistingIndexedPropertySetter,
  ExistingNamedPropertyDeleter,
  ExistingNamedPropertySetter,
  Exposed,
  IndexedPropertyDeterminator,
  IndexedPropertyGetter,
  IndexedPropertySetter,
  NamedPropertyDeterminator,
  NamedPropertyDeleter,
  NamedPropertyGetter,
  NamedPropertySetter,
  NewIndexedPropertySetter,
  NewNamedPropertySetter,
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

function makeNamedGetter(): NamedPropertyGetterOperation {
  return makeOperation({
    keywords: ["getter"],
    argumentTypes: [makeDOMStringType()],
  }) as NamedPropertyGetterOperation;
}

function makeNamedSetter(): NamedPropertySetterOperation {
  return makeOperation({
    keywords: ["setter"],
    argumentTypes: [makeDOMStringType(), makeLongType()],
  }) as NamedPropertySetterOperation;
}

function makeNamedDeleter(): NamedPropertyDeleterOperation {
  return makeOperation({
    keywords: ["deleter"],
    argumentTypes: [makeDOMStringType()],
  }) as NamedPropertyDeleterOperation;
}

function makeIndexedGetter(): IndexedPropertyGetterOperation {
  return makeOperation({
    keywords: ["getter"],
    argumentTypes: [makeUnsignedLongType()],
  }) as IndexedPropertyGetterOperation;
}

function makeIndexedSetter(): IndexedPropertySetterOperation {
  return makeOperation({
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
        }) as NamedPropertyGetterOperation,
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

describe("validateInterface - static members require the static keyword", () => {
  test("throws for a static member declared without the static keyword", () => {
    const iface = makeInterface({
      staticMembers: {
        make: makeOperation({ identifier: "make" }),
      },
    });

    expect(() => validateInterface(iface)).toThrow(/static/i);
  });

  test("does not throw for a static operation declared with the static keyword", () => {
    const iface = makeInterface({
      staticMembers: {
        make: makeOperation({ identifier: "make", keywords: ["static"] }),
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
        constructor: makeConstructor({ argumentTypes: [makeLongType()] }),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("throws for a constructor operation with an invalid argument list", () => {
    const iface = makeInterface({
      members: {
        constructor: makeConstructor({
          arguments: [
            { type: makeLongType(), identifier: "x" },
            { type: makeLongType(), identifier: "x" },
          ],
        }),
      },
    });

    expect(() => validateInterface(iface)).toThrow(/declared twice/i);
  });

  test("throws for a constructor argument with a default value but no optional keyword", () => {
    const iface = makeInterface({
      members: {
        constructor: makeConstructor({
          arguments: [
            { type: makeLongType(), identifier: "x", defaultValue: 0 },
          ],
        }),
      },
    });

    expect(() => validateInterface(iface)).toThrow(/optional/i);
  });

  test("does not throw for a constructor with an optional argument", () => {
    const iface = makeInterface({
      members: {
        constructor: makeConstructor({
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
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("still validates the interface's other members alongside a constructor", () => {
    const iface = makeInterface({
      members: {
        constructor: makeConstructor({}),
        attr: makeAttribute({ type: makeDOMStringType(), identifier: "1bad" }),
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

describe("validateInterface - unnamed indexed property getter", () => {
  test("throws without steps to determine the value of an indexed property", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
        [IndexedPropertyGetter]: makeUnnamedIndexedGetter(),
        [SupportedPropertyIndices]: makeSupportedPropertyIndices(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw once those steps are provided", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
        [IndexedPropertyGetter]: makeUnnamedIndexedGetter(),
        [SupportedPropertyIndices]: makeSupportedPropertyIndices(),
        [IndexedPropertyDeterminator]: () => undefined,
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("does not require those steps when the getter is named", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
        [IndexedPropertyGetter]: makeIndexedGetter(),
        [SupportedPropertyIndices]: makeSupportedPropertyIndices(),
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
        [IndexedPropertyGetter]: makeIndexedGetter(),
        [SupportedPropertyIndices]: makeSupportedPropertyIndices(),
        [IndexedPropertySetter]: makeUnnamedIndexedSetter(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("throws when only the new-property steps are present", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
        [IndexedPropertyGetter]: makeIndexedGetter(),
        [SupportedPropertyIndices]: makeSupportedPropertyIndices(),
        [IndexedPropertySetter]: makeUnnamedIndexedSetter(),
        [NewIndexedPropertySetter]: () => undefined,
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw once both new and existing steps are provided", () => {
    const iface = makeInterface({
      members: {
        length: makeLengthAttribute(),
        [IndexedPropertyGetter]: makeIndexedGetter(),
        [SupportedPropertyIndices]: makeSupportedPropertyIndices(),
        [IndexedPropertySetter]: makeUnnamedIndexedSetter(),
        [NewIndexedPropertySetter]: () => undefined,
        [ExistingIndexedPropertySetter]: () => undefined,
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

describe("validateInterface - unnamed named property getter", () => {
  test("throws without steps to determine the value of a named property", () => {
    const iface = makeInterface({
      members: {
        [NamedPropertyGetter]: makeUnnamedNamedGetter(),
        [SupportedPropertyNames]: makeSupportedPropertyNames(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw once those steps are provided", () => {
    const iface = makeInterface({
      members: {
        [NamedPropertyGetter]: makeUnnamedNamedGetter(),
        [SupportedPropertyNames]: makeSupportedPropertyNames(),
        [NamedPropertyDeterminator]: () => undefined,
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

describe("validateInterface - unnamed named property setter", () => {
  test("throws without steps to set new and existing named properties", () => {
    const iface = makeInterface({
      members: {
        [NamedPropertyGetter]: makeNamedGetter(),
        [SupportedPropertyNames]: makeSupportedPropertyNames(),
        [NamedPropertySetter]: makeUnnamedNamedSetter(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw once both new and existing steps are provided", () => {
    const iface = makeInterface({
      members: {
        [NamedPropertyGetter]: makeNamedGetter(),
        [SupportedPropertyNames]: makeSupportedPropertyNames(),
        [NamedPropertySetter]: makeUnnamedNamedSetter(),
        [NewNamedPropertySetter]: () => undefined,
        [ExistingNamedPropertySetter]: () => undefined,
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});

describe("validateInterface - unnamed named property deleter", () => {
  test("throws without steps to delete an existing named property", () => {
    const iface = makeInterface({
      members: {
        [NamedPropertyGetter]: makeNamedGetter(),
        [SupportedPropertyNames]: makeSupportedPropertyNames(),
        [NamedPropertyDeleter]: makeUnnamedNamedDeleter(),
      },
    });

    expect(() => validateInterface(iface)).toThrow(TypeError);
  });

  test("does not throw once those steps are provided", () => {
    const iface = makeInterface({
      members: {
        [NamedPropertyGetter]: makeNamedGetter(),
        [SupportedPropertyNames]: makeSupportedPropertyNames(),
        [NamedPropertyDeleter]: makeUnnamedNamedDeleter(),
        [ExistingNamedPropertyDeleter]: () => undefined,
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});
