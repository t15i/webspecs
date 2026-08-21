/**
 * @see https://webidl.spec.whatwg.org/#dfn-unforgeable-on-an-interface
 *
 * A member is unforgeable on an interface when it is an attribute or
 * operation declared with the [LegacyUnforgeable] extended attribute. The spec
 * requires the attribute to appear on all operations with the same identifier,
 * so the first overload of a slot answers for the rest — a slot that disagrees
 * with itself is rejected by `validateInterface` before anything reads it.
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

function makeInterface(
  members: Interface["members"] = {},
  inherit: Interface | null = null,
): Interface {
  return {
    identifier: "Unnamed",
    extendedAttributes: { [Exposed]: "*" },
    inherit,
    members,
    staticMembers: {},
    behaviors: {},
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
      operate: [
        makeOperation({
          extendedAttributes: { [LegacyUnforgeable]: undefined },
        }),
      ],
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

  test("reads the first overload, which stands for the whole slot", () => {
    // The spec requires [LegacyUnforgeable] on every operation with a given
    // identifier if it appears on one, and `validateInterface` rejects a slot
    // that breaks it, so no slot reaching here disagrees with its first
    // overload.
    const iface = makeInterface({
      f: [unforgeable(), makeOperation({ identifier: "f" })],
    });

    expect(isUnforgeableOnInterface(iface, "f")).toBe(true);
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

/**
 * @see https://webidl.spec.whatwg.org/#LegacyUnforgeable
 *
 * "If an attribute or operation X is unforgeable on an interface A, and A is
 * one of the inherited interfaces of another interface B, then B must not have
 * a regular attribute or non-static operation with the same identifier as X."
 * An unforgeable member lives on the instance itself as a non-configurable own
 * property, so a member of the same name further down would be unreachable.
 */
describe("validateInterface - [LegacyUnforgeable] against inherited interfaces", () => {
  const unforgeableAttribute = () =>
    makeAttribute({
      type: makeDOMStringType(),
      identifier: "attr",
      extendedAttributes: { [LegacyUnforgeable]: undefined },
    });

  const unforgeableOperation = () =>
    makeOperation({
      identifier: "f",
      extendedAttributes: { [LegacyUnforgeable]: undefined },
    });

  test("throws when the interface redeclares an unforgeable attribute of its parent", () => {
    const parent = makeInterface({ attr: unforgeableAttribute() });
    const child = makeInterface(
      {
        attr: makeAttribute({ type: makeDOMStringType(), identifier: "attr" }),
      },
      parent,
    );

    expect(() => validateInterface(child)).toThrow(/unforgeable on/);
  });

  test("throws when the interface redeclares an unforgeable operation of its parent", () => {
    const parent = makeInterface({ f: [unforgeableOperation()] });
    const child = makeInterface(
      { f: [makeOperation({ identifier: "f" })] },
      parent,
    );

    expect(() => validateInterface(child)).toThrow(/unforgeable on/);
  });

  test("throws for an interface further up the inheritance chain", () => {
    const grandparent = makeInterface({ attr: unforgeableAttribute() });
    const parent = makeInterface({}, grandparent);
    const child = makeInterface(
      {
        attr: makeAttribute({ type: makeDOMStringType(), identifier: "attr" }),
      },
      parent,
    );

    expect(() => validateInterface(child)).toThrow(/unforgeable on/);
  });

  test("does not throw when the inherited member is not unforgeable", () => {
    const parent = makeInterface({
      attr: makeAttribute({ type: makeDOMStringType(), identifier: "attr" }),
    });
    const child = makeInterface(
      {
        attr: makeAttribute({ type: makeDOMStringType(), identifier: "attr" }),
      },
      parent,
    );

    expect(() => validateInterface(child)).not.toThrow();
  });

  test("does not throw when the identifier is declared on the parent only", () => {
    const parent = makeInterface({ attr: unforgeableAttribute() });
    const child = makeInterface(
      { other: makeAttribute({ type: makeLongType(), identifier: "other" }) },
      parent,
    );

    expect(() => validateInterface(child)).not.toThrow();
  });

  test("does not throw for an interface that inherits from nothing", () => {
    expect(() =>
      validateInterface(makeInterface({ attr: unforgeableAttribute() })),
    ).not.toThrow();
  });
});
