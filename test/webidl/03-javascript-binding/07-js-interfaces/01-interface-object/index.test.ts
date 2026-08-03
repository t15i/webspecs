/**
 * @see https://webidl.spec.whatwg.org/#create-an-interface-object
 *
 * The interface object is a constructable built-in function whose `name` is the
 * interface identifier, whose `length` is the constructor's argument count, and
 * whose `prototype` is a non-writable, non-enumerable, non-configurable data
 * property holding the interface prototype object. It defines the interface's
 * constants and static members, chains through `[[Prototype]]` to the inherited
 * interface object, and constructs instances through the constructor steps.
 */
import { describe, expect, test } from "vitest";
import {
  getInterfaceObject,
  getInterfacePrototypeObject,
  LegacyUnforgeable,
} from "lib/webidl";

import { getUnforgeables, makeInterface } from "../utils";
import {
  makeAttribute,
  makeConstructor,
  makeOperation,
} from "../../../02-idl/05-idl-members/utils";
import {
  makeDOMStringType,
  makeLongType,
} from "../../../02-idl/13-idl-types/utils";

function ownProps(o: object): Record<PropertyKey, unknown> {
  return o as Record<PropertyKey, unknown>;
}

describe("getInterfaceObject - function shape", () => {
  test("is a constructable function named after the interface", () => {
    const F = getInterfaceObject(makeInterface({ identifier: "Widget" }));
    expect(typeof F).toBe("function");
    expect(F.name).toBe("Widget");
  });

  test("length is 0 when the interface has no constructor", () => {
    expect(getInterfaceObject(makeInterface()).length).toBe(0);
  });

  test("length equals the constructor's argument count", () => {
    const iface = makeInterface({
      members: {
        constructor: makeConstructor({
          argumentTypes: [makeLongType(), makeDOMStringType()],
        }),
      },
    });
    expect(getInterfaceObject(iface).length).toBe(2);
  });
});

describe("getInterfaceObject - prototype property", () => {
  test("is the interface prototype object, non-writable/enumerable/configurable", () => {
    const iface = makeInterface();
    const F = getInterfaceObject(iface);
    const descriptor = Object.getOwnPropertyDescriptor(F, "prototype")!;

    expect(descriptor.value).toBe(getInterfacePrototypeObject(iface));
    expect(descriptor.writable).toBe(false);
    expect(descriptor.enumerable).toBe(false);
    expect(descriptor.configurable).toBe(false);
  });
});

describe("getInterfaceObject - [[Prototype]]", () => {
  test("is Function.prototype without inheritance", () => {
    expect(Object.getPrototypeOf(getInterfaceObject(makeInterface()))).toBe(
      Function.prototype,
    );
  });

  test("is the inherited interface object", () => {
    const parent = makeInterface({ identifier: "Parent" });
    const child = makeInterface({ identifier: "Child", inherit: parent });
    expect(Object.getPrototypeOf(getInterfaceObject(child))).toBe(
      getInterfaceObject(parent),
    );
  });
});

describe("getInterfaceObject - static members", () => {
  test("defines static operations on the interface object", () => {
    const iface = makeInterface({
      staticMembers: {
        make: makeOperation({
          identifier: "make",
          keywords: ["static"],
          methodSteps: () => "made",
        }),
      },
    });
    const F = getInterfaceObject(iface);
    expect((ownProps(F)["make"] as () => unknown)()).toBe("made");
  });

  test("defines static attributes on the interface object", () => {
    const iface = makeInterface({
      staticMembers: {
        version: makeAttribute({
          type: makeLongType(),
          identifier: "version",
          keywords: ["static", "readonly"],
          getterSteps: () => 3,
        }),
      },
    });
    expect(ownProps(getInterfaceObject(iface))["version"]).toBe(3);
  });
});

describe("getInterfaceObject - construction", () => {
  test("new invokes the constructor steps with converted arguments", () => {
    const seen: unknown[] = [];
    const instance = { tag: "made" };
    const iface = makeInterface({
      identifier: "Widget",
      members: {
        constructor: makeConstructor({
          argumentTypes: [makeLongType()],
          constructorSteps: function (n: unknown) {
            seen.push(n);
            return instance;
          },
        }),
      },
    });
    const F = getInterfaceObject(iface);

    const result = Reflect.construct(F, ["5"]);

    expect(seen).toEqual([5]);
    expect(result).toBe(instance);
  });

  test("calling without new throws a TypeError", () => {
    const iface = makeInterface({
      members: { constructor: makeConstructor({}) },
    });
    expect(() =>
      Reflect.apply(getInterfaceObject(iface), undefined, []),
    ).toThrow(TypeError);
  });

  test("constructing an interface without a constructor throws", () => {
    expect(() =>
      Reflect.construct(getInterfaceObject(makeInterface()), []),
    ).toThrow(TypeError);
  });
});

describe("getInterfaceObject - unforgeable members", () => {
  test("excludes unforgeable regular attributes from the interface object", () => {
    const iface = makeInterface({
      members: {
        secret: makeAttribute({
          type: makeLongType(),
          identifier: "secret",
          keywords: ["readonly"],
          extendedAttributes: { [LegacyUnforgeable]: undefined },
        }),
      },
    });
    const F = getInterfaceObject(iface);
    // The unforgeable attribute lives on the [[Unforgeables]] object, not on the
    // interface object or its prototype.
    expect(Object.getOwnPropertyDescriptor(F, "secret")).toBeUndefined();

    const unforgeableDescriptor = Object.getOwnPropertyDescriptor(
      getUnforgeables(F),
      "secret",
    )!;
    expect(typeof unforgeableDescriptor.get).toBe("function");
    expect(unforgeableDescriptor.configurable).toBe(false);
    expect(unforgeableDescriptor.enumerable).toBe(true);
  });

  test("defines unforgeable regular operations on the [[Unforgeables]] object", () => {
    const iface = makeInterface({
      members: {
        lock: makeOperation({
          identifier: "lock",
          methodSteps: () => "locked",
          extendedAttributes: { [LegacyUnforgeable]: undefined },
        }),
      },
    });
    const F = getInterfaceObject(iface);
    const descriptor = Object.getOwnPropertyDescriptor(
      getUnforgeables(F),
      "lock",
    )!;
    expect(typeof descriptor.value).toBe("function");
    expect(descriptor.writable).toBe(false);
    expect(descriptor.enumerable).toBe(true);
    expect(descriptor.configurable).toBe(false);
  });
});

describe("getInterfaceObject - idempotency", () => {
  test("returns the same interface object on repeated calls", () => {
    const iface = makeInterface();
    expect(getInterfaceObject(iface)).toBe(getInterfaceObject(iface));
  });
});
