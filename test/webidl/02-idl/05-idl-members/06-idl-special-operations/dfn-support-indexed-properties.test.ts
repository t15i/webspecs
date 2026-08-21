/**
 * @see https://webidl.spec.whatwg.org/#dfn-support-indexed-properties
 *
 * An interface supports indexed properties exactly when it declares an indexed
 * property getter. `isInterfaceSupportIndexedProperties` answers that from the
 * interface definition (as opposed to `supportsIndexedProperties`, which asks
 * of a concrete platform object).
 */
import { describe, expect, test } from "vitest";
import {
  Exposed,
  IndexedPropertyGetter,
  isInterfaceSupportIndexedProperties,
  type IndexedPropertyGetterOperation,
  type Interface,
} from "lib/webidl";

import { makeOperation } from "../utils";
import { makeUnsignedLongType } from "../../13-idl-types/utils";

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

function makeIndexedGetter(): IndexedPropertyGetterOperation {
  return makeOperation({
    keywords: ["getter"],
    argumentTypes: [makeUnsignedLongType()],
  }) as IndexedPropertyGetterOperation;
}

describe("isInterfaceSupportIndexedProperties", () => {
  test("is true for an interface declaring an indexed property getter", () => {
    const iface = makeInterface({
      members: { [IndexedPropertyGetter]: makeIndexedGetter() },
    });

    expect(isInterfaceSupportIndexedProperties(iface)).toBe(true);
  });

  test("is false for an interface without an indexed property getter", () => {
    const iface = makeInterface({
      members: { foo: [makeOperation({ identifier: "foo" })] },
    });

    expect(isInterfaceSupportIndexedProperties(iface)).toBe(false);
  });

  test("is false for an interface with no members", () => {
    expect(isInterfaceSupportIndexedProperties(makeInterface())).toBe(false);
  });
});
