/**
 * @see https://webidl.spec.whatwg.org/#interface-prototype-object
 *
 * `InterfacePrototypeObject` is the identity registry that associates an
 * interface prototype object with the interface it belongs to. It is an
 * identity map: lookups are by object reference, an unregistered proto resolves
 * to `null`, and `setInterfaceOf` returns the very proto it was handed so it can
 * be used fluently.
 */
import { describe, expect, test } from "vitest";
import { InterfacePrototypeObject } from "lib/webidl";
import type { InterfacePrototypeObject as InterfacePrototypeObjectShape } from "lib/webidl";

import { makeInterface } from "../utils";

/**
 * An interface prototype object's `constructor` points back at its interface
 * object (a constructor); any object carrying such a `constructor` satisfies the
 * shape the registry expects.
 */
function makeProto(): InterfacePrototypeObjectShape {
  return { constructor: class {} };
}

describe("InterfacePrototypeObject.getInterfaceOf", () => {
  test("returns null for a proto that was never registered", () => {
    expect(InterfacePrototypeObject.getInterfaceOf(makeProto())).toBeNull();
  });
});

describe("InterfacePrototypeObject.setInterfaceOf", () => {
  test("records the interface so getInterfaceOf resolves it", () => {
    const proto = makeProto();
    const iface = makeInterface();

    InterfacePrototypeObject.setInterfaceOf(proto, iface);

    expect(InterfacePrototypeObject.getInterfaceOf(proto)).toBe(iface);
  });

  test("returns the same proto object it was given", () => {
    const proto = makeProto();

    expect(
      InterfacePrototypeObject.setInterfaceOf(proto, makeInterface()),
    ).toBe(proto);
  });

  test("keeps registrations of distinct protos independent", () => {
    const a = makeProto();
    const b = makeProto();
    const ifaceA = makeInterface({ identifier: "A" });
    const ifaceB = makeInterface({ identifier: "B" });

    InterfacePrototypeObject.setInterfaceOf(a, ifaceA);
    InterfacePrototypeObject.setInterfaceOf(b, ifaceB);

    expect(InterfacePrototypeObject.getInterfaceOf(a)).toBe(ifaceA);
    expect(InterfacePrototypeObject.getInterfaceOf(b)).toBe(ifaceB);
  });

  test("overwrites a previous registration for the same proto", () => {
    const proto = makeProto();
    const first = makeInterface({ identifier: "First" });
    const second = makeInterface({ identifier: "Second" });

    InterfacePrototypeObject.setInterfaceOf(proto, first);
    InterfacePrototypeObject.setInterfaceOf(proto, second);

    expect(InterfacePrototypeObject.getInterfaceOf(proto)).toBe(second);
  });

  test("looks proto up by identity, not by structural equality", () => {
    const proto = makeProto();
    InterfacePrototypeObject.setInterfaceOf(proto, makeInterface());

    // A different object with the same shape is not the registered key.
    expect(InterfacePrototypeObject.getInterfaceOf(makeProto())).toBeNull();
  });
});
