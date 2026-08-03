/**
 * @see https://webidl.spec.whatwg.org/#create-an-interface-prototype-object
 *
 * The interface prototype object holds the interface's regular attributes
 * (accessors), regular operations (data properties), iteration methods, and
 * constants, plus a `constructor` data property pointing back at the interface
 * object. Its `[[Prototype]]` is the inherited interface's prototype, or
 * `%Error.prototype%` for DOMException, or `%Object.prototype%` otherwise.
 */
import { describe, expect, test } from "vitest";
import {
  getInterfaceObject,
  getInterfacePrototypeObject,
  IndexedPropertyGetter,
  LegacyUnforgeable,
  type IndexedPropertyGetterOperation,
} from "lib/webidl";

import { makeInterface } from "../utils";
import {
  makeAttribute,
  makeOperation,
} from "../../../02-idl/05-idl-members/utils";
import {
  makeLongType,
  makeUnsignedLongType,
} from "../../../02-idl/13-idl-types/utils";

describe("createInterfacePrototypeObject - constructor property", () => {
  test("points back at the interface object (W:true, E:false, C:true)", () => {
    const iface = makeInterface();
    const proto = getInterfacePrototypeObject(iface);
    const descriptor = Object.getOwnPropertyDescriptor(proto, "constructor")!;

    expect(descriptor.value).toBe(getInterfaceObject(iface));
    expect(descriptor.writable).toBe(true);
    expect(descriptor.enumerable).toBe(false);
    expect(descriptor.configurable).toBe(true);
  });
});

describe("createInterfacePrototypeObject - [[Prototype]]", () => {
  test("is Object.prototype by default", () => {
    expect(
      Object.getPrototypeOf(getInterfacePrototypeObject(makeInterface())),
    ).toBe(Object.prototype);
  });

  test("is the inherited interface's prototype object", () => {
    const parent = makeInterface({ identifier: "Parent" });
    const child = makeInterface({ identifier: "Child", inherit: parent });
    expect(Object.getPrototypeOf(getInterfacePrototypeObject(child))).toBe(
      getInterfacePrototypeObject(parent),
    );
  });

  test("is Error.prototype for DOMException", () => {
    expect(
      Object.getPrototypeOf(
        getInterfacePrototypeObject(
          makeInterface({ identifier: "DOMException" }),
        ),
      ),
    ).toBe(Error.prototype);
  });
});

describe("createInterfacePrototypeObject - members", () => {
  test("a read-only regular attribute is an accessor with only a getter", () => {
    const iface = makeInterface({
      members: {
        foo: makeAttribute({
          type: makeLongType(),
          identifier: "foo",
          keywords: ["readonly"],
          getterSteps: () => 1,
        }),
      },
    });
    const descriptor = Object.getOwnPropertyDescriptor(
      getInterfacePrototypeObject(iface),
      "foo",
    )!;

    expect(typeof descriptor.get).toBe("function");
    expect(descriptor.set).toBeUndefined();
    expect(descriptor.enumerable).toBe(true);
    expect(descriptor.configurable).toBe(true);
  });

  test("a read-write regular attribute has both a getter and a setter", () => {
    const iface = makeInterface({
      members: {
        foo: makeAttribute({ type: makeLongType(), identifier: "foo" }),
      },
    });
    const descriptor = Object.getOwnPropertyDescriptor(
      getInterfacePrototypeObject(iface),
      "foo",
    )!;

    expect(typeof descriptor.get).toBe("function");
    expect(typeof descriptor.set).toBe("function");
  });

  test("a regular operation is a data property (W:true, E:true, C:true)", () => {
    const iface = makeInterface({
      members: {
        doIt: makeOperation({ identifier: "doIt", methodSteps: () => "ok" }),
      },
    });
    const descriptor = Object.getOwnPropertyDescriptor(
      getInterfacePrototypeObject(iface),
      "doIt",
    )!;

    expect(typeof descriptor.value).toBe("function");
    expect(descriptor.writable).toBe(true);
    expect(descriptor.enumerable).toBe(true);
    expect(descriptor.configurable).toBe(true);
  });

  test("an operation without an identifier is not a regular operation and is not defined", () => {
    // Per spec an operation only declares a regular operation when it has an
    // identifier; an identifier-less (special) operation must not surface as a
    // named property on the prototype.
    const iface = makeInterface({
      members: {
        anon: makeOperation({ identifier: undefined, methodSteps: () => "x" }),
      },
    });
    const proto = getInterfacePrototypeObject(iface);

    expect(Object.getOwnPropertyDescriptor(proto, "undefined")).toBeUndefined();
  });

  test("excludes an unforgeable operation from the prototype", () => {
    const iface = makeInterface({
      members: {
        pin: makeOperation({
          identifier: "pin",
          methodSteps: () => "pinned",
          extendedAttributes: { [LegacyUnforgeable]: undefined },
        }),
      },
    });
    // Unforgeable members are defined on the [[Unforgeables]] object, not on the
    // interface prototype object.
    expect(
      Object.getOwnPropertyDescriptor(
        getInterfacePrototypeObject(iface),
        "pin",
      ),
    ).toBeUndefined();
  });
});

describe("createInterfacePrototypeObject - iteration methods", () => {
  test("binds Symbol.iterator to Array.prototype.values for an indexed getter", () => {
    const iface = makeInterface({
      members: {
        [IndexedPropertyGetter]: makeOperation({
          keywords: ["getter"],
          argumentTypes: [makeUnsignedLongType()],
        }) as IndexedPropertyGetterOperation,
      },
    });
    const descriptor = Object.getOwnPropertyDescriptor(
      getInterfacePrototypeObject(iface),
      Symbol.iterator,
    )!;

    expect(descriptor.value).toBe(Array.prototype.values);
    expect(descriptor.writable).toBe(true);
    expect(descriptor.enumerable).toBe(false);
    expect(descriptor.configurable).toBe(true);
  });

  test("does not define Symbol.iterator without an indexed getter", () => {
    expect(
      Object.getOwnPropertyDescriptor(
        getInterfacePrototypeObject(makeInterface()),
        Symbol.iterator,
      ),
    ).toBeUndefined();
  });
});
