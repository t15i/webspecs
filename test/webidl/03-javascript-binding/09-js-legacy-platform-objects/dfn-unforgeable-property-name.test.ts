/**
 * @see https://webidl.spec.whatwg.org/#dfn-unforgeable-property-name
 *
 * A property name is unforgeable on an object when it is unforgeable on the
 * object's primary interface or on any interface that interface inherits. The
 * chain is walked through each interface's `inherit` reference.
 */
import { describe, expect, test } from "vitest";
import {
  Exposed,
  LegacyUnforgeable,
  isUnforgeablePropertyName,
  type Interface,
  type PlatformObject,
} from "lib/webidl";

import { makeAttribute } from "../../02-idl/05-idl-members/utils";
import {
  associateInterface,
  makeDOMStringType,
} from "../../02-idl/13-idl-types/utils";

function makeInterface(overrides: Partial<Interface> = {}): Interface {
  return {
    identifier: "Example",
    extendedAttributes: { [Exposed]: "*" },
    inherit: null,
    members: {},
    staticMembers: {},
    behaviors: {},
    ...overrides,
  };
}

function makeUnforgeableAttribute() {
  return makeAttribute({
    type: makeDOMStringType(),
    identifier: "id",
    keywords: ["readonly"],
    extendedAttributes: { [LegacyUnforgeable]: null },
  });
}

describe("isUnforgeablePropertyName", () => {
  test("finds an unforgeable attribute on the object's own interface", () => {
    const iface = makeInterface({
      members: { id: makeUnforgeableAttribute() },
    });
    const obj = associateInterface({}, iface) as PlatformObject;

    expect(isUnforgeablePropertyName(obj, "id")).toBe(true);
  });

  test("walks the inherited interface chain via inherit", () => {
    const parent = makeInterface({
      identifier: "Parent",
      members: { id: makeUnforgeableAttribute() },
    });
    const child = makeInterface({ identifier: "Child", inherit: parent });
    const obj = associateInterface({}, child) as PlatformObject;

    expect(isUnforgeablePropertyName(obj, "id")).toBe(true);
  });

  test("returns false when no interface in the chain marks the name unforgeable", () => {
    const parent = makeInterface({ identifier: "Parent" });
    const child = makeInterface({ identifier: "Child", inherit: parent });
    const obj = associateInterface({}, child) as PlatformObject;

    expect(isUnforgeablePropertyName(obj, "id")).toBe(false);
  });
});
