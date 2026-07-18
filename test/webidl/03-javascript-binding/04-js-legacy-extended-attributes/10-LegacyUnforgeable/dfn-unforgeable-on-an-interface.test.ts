/**
 * @see https://webidl.spec.whatwg.org/#dfn-unforgeable-on-an-interface
 *
 * A member is unforgeable on an interface when it is an attribute or
 * operation declared with the [LegacyUnforgeable] extended attribute.
 */
import { describe, expect, test } from "vitest";
import {
  Exposed,
  isUnforgeableOnInterface,
  LegacyUnforgeable,
  type Interface,
} from "lib/webidl";

import {
  makeAttribute,
  makeOperation,
} from "../../../02-idl/05-idl-members/utils";
import { makeDOMStringType } from "../../../02-idl/13-idl-types/utils";

function makeInterface(members: Interface["members"] = {}): Interface {
  return {
    identifier: "Unnamed",
    extendedAttributes: { [Exposed]: "*" },
    members,
    staticMembers: {},
  };
}

describe("isUnforgeableOnInterface", () => {
  test("returns true for an attribute declared with [LegacyUnforgeable]", () => {
    const iface = makeInterface({
      attr: makeAttribute({
        type: makeDOMStringType(),
        extendedAttributes: { [LegacyUnforgeable]: undefined },
      }),
    });
    expect(isUnforgeableOnInterface(iface, "attr")).toBe(true);
  });

  test("returns true for an operation declared with [LegacyUnforgeable]", () => {
    const iface = makeInterface({
      operate: makeOperation({
        extendedAttributes: { [LegacyUnforgeable]: undefined },
      }),
    });
    expect(isUnforgeableOnInterface(iface, "operate")).toBe(true);
  });

  test("returns false for a member without [LegacyUnforgeable]", () => {
    const iface = makeInterface({
      attr: makeAttribute({ type: makeDOMStringType() }),
    });
    expect(isUnforgeableOnInterface(iface, "attr")).toBe(false);
  });

  test("returns false for an identifier not on the interface", () => {
    expect(isUnforgeableOnInterface(makeInterface(), "missing")).toBe(false);
  });
});
