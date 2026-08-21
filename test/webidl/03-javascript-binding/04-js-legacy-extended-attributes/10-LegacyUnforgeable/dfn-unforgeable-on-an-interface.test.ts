/**
 * @see https://webidl.spec.whatwg.org/#dfn-unforgeable-on-an-interface
 *
 * A member is unforgeable on an interface when it is an attribute or
 * operation declared with the [LegacyUnforgeable] extended attribute. The spec
 * requires the attribute to appear on all operations with the same identifier,
 * so an overloaded identifier is unforgeable only when every overload carries
 * it.
 */
import { describe, expect, test } from "vitest";
import {
  Exposed,
  isUnforgeableOnInterface,
  LegacyUnforgeable,
  validateInterface,
  type Interface,
  type Type,
} from "lib/webidl";

import {
  makeAttribute,
  makeOperation,
} from "../../../02-idl/05-idl-members/utils";
import {
  makeDOMStringType,
  makeLongType,
} from "../../../02-idl/13-idl-types/utils";

function makeInterface(members: Interface["members"] = {}): Interface {
  return {
    identifier: "Unnamed",
    extendedAttributes: { [Exposed]: "*" },
    inherit: null,
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

describe("isUnforgeableOnInterface - overloaded operations", () => {
  const unforgeable = () =>
    makeOperation({
      identifier: "f",
      extendedAttributes: { [LegacyUnforgeable]: undefined },
    });

  test("returns true when every overload is declared with the attribute", () => {
    const iface = makeInterface({ f: [unforgeable(), unforgeable()] });

    expect(isUnforgeableOnInterface(iface, "f")).toBe(true);
  });

  test("returns false when only some overloads are declared with it", () => {
    const iface = makeInterface({
      f: [unforgeable(), makeOperation({ identifier: "f" })],
    });

    expect(isUnforgeableOnInterface(iface, "f")).toBe(false);
  });

  test("returns false for a slot holding no operations", () => {
    const iface = makeInterface({ f: [] });

    expect(isUnforgeableOnInterface(iface, "f")).toBe(false);
  });
});

describe("validateInterface - [LegacyUnforgeable] across overloads", () => {
  // The two overloads must stay distinguishable, or the interface is rejected
  // for that reason before this rule is ever reached.
  const plain = (type: Type) =>
    makeOperation({ identifier: "f", argumentTypes: [type] });
  const unforgeable = (type: Type) =>
    makeOperation({
      identifier: "f",
      argumentTypes: [type],
      extendedAttributes: { [LegacyUnforgeable]: undefined },
    });

  test("does not throw when every overload declares it", () => {
    const iface = makeInterface({
      f: [unforgeable(makeLongType()), unforgeable(makeDOMStringType())],
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("does not throw when no overload declares it", () => {
    const iface = makeInterface({
      f: [plain(makeLongType()), plain(makeDOMStringType())],
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("throws when only some overloads declare it", () => {
    const iface = makeInterface({
      f: [unforgeable(makeLongType()), plain(makeDOMStringType())],
    });

    expect(() => validateInterface(iface)).toThrow(
      /all operations with the same identifier/,
    );
  });
});
