/**
 * @see https://webidl.spec.whatwg.org/#dfn-support-named-properties
 *
 * An interface supports named properties exactly when it declares a named
 * property getter. `isInterfaceSupportNamedProperties` answers that from the
 * interface definition (as opposed to `supportsNamedProperties`, which asks of
 * a concrete platform object).
 */
import { describe, expect, test } from "vitest";
import {
  Exposed,
  isInterfaceSupportNamedProperties,
  NamedPropertyGetter,
  type Interface,
  type NamedPropertyGetterOperation,
} from "lib/webidl";

import { makeOperation } from "../utils";
import { makeDOMStringType } from "../../13-idl-types/utils";

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

describe("isInterfaceSupportNamedProperties", () => {
  test("is true for an interface declaring a named property getter", () => {
    const iface = makeInterface({
      members: { [NamedPropertyGetter]: makeNamedGetter() },
    });

    expect(isInterfaceSupportNamedProperties(iface)).toBe(true);
  });

  test("is false for an interface without a named property getter", () => {
    const iface = makeInterface({
      members: { foo: makeOperation({ identifier: "foo" }) },
    });

    expect(isInterfaceSupportNamedProperties(iface)).toBe(false);
  });

  test("is false for an interface with no members", () => {
    expect(isInterfaceSupportNamedProperties(makeInterface())).toBe(false);
  });
});
