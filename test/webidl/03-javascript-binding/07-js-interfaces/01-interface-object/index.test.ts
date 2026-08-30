/**
 * @see https://webidl.spec.whatwg.org/#interface-object
 *
 * `InterfaceObject` is the identity registry that associates an interface
 * object - the constructor - with the interface it belongs to. It is the twin
 * of `InterfacePrototypeObject`: an identity map, lookups by object reference,
 * an unregistered object resolves to `null`, and `setInterfaceOf` returns the
 * very object it was handed so it can be used fluently.
 */
import { describe, expect, test } from "vitest";
import { InterfaceObject, InterfacePrototypeObject } from "lib/webidl";
import type { InterfaceObject as InterfaceObjectShape } from "lib/webidl";

import { makeInterface } from "../utils";

/** An interface object is a constructor, and any class is one. */
function makeObject(): InterfaceObjectShape {
  return class {};
}

describe("InterfaceObject.getInterfaceOf", () => {
  test("returns null for an object that was never registered", () => {
    expect(InterfaceObject.getInterfaceOf(makeObject())).toBeNull();
  });
});

describe("InterfaceObject.setInterfaceOf", () => {
  test("records the interface so getInterfaceOf resolves it", () => {
    const obj = makeObject();
    const iface = makeInterface();

    InterfaceObject.setInterfaceOf(obj, iface);

    expect(InterfaceObject.getInterfaceOf(obj)).toBe(iface);
  });

  test("returns the same object it was given", () => {
    const obj = makeObject();

    expect(InterfaceObject.setInterfaceOf(obj, makeInterface())).toBe(obj);
  });

  test("keeps registrations of distinct objects independent", () => {
    const a = makeObject();
    const b = makeObject();
    const ifaceA = makeInterface({ identifier: "A" });
    const ifaceB = makeInterface({ identifier: "B" });

    InterfaceObject.setInterfaceOf(a, ifaceA);
    InterfaceObject.setInterfaceOf(b, ifaceB);

    expect(InterfaceObject.getInterfaceOf(a)).toBe(ifaceA);
    expect(InterfaceObject.getInterfaceOf(b)).toBe(ifaceB);
  });

  test("overwrites a previous registration for the same object", () => {
    const obj = makeObject();
    const first = makeInterface({ identifier: "First" });
    const second = makeInterface({ identifier: "Second" });

    InterfaceObject.setInterfaceOf(obj, first);
    InterfaceObject.setInterfaceOf(obj, second);

    expect(InterfaceObject.getInterfaceOf(obj)).toBe(second);
  });

  test("looks the object up by identity, not by structural equality", () => {
    const obj = makeObject();
    InterfaceObject.setInterfaceOf(obj, makeInterface());

    // A different constructor of the same shape is not the registered key.
    expect(InterfaceObject.getInterfaceOf(makeObject())).toBeNull();
  });

  test("keeps its registry apart from the one of the prototype objects", () => {
    const obj = makeObject();
    const iface = makeInterface();

    InterfaceObject.setInterfaceOf(obj, iface);

    // The two sides of an interface are registered on their own, so nothing
    // about the constructor is known about its prototype until it is set too.
    expect(InterfacePrototypeObject.getInterfaceOf(obj.prototype)).toBeNull();
  });
});
