/**
 * @see https://webidl.spec.whatwg.org/#Exposed
 *
 * "If [Exposed] appears on an overloaded operation, then it must appear
 * identically on all overloads." One identifier gets one property on the
 * prototype, so the overloads cannot disagree about the set of globals that
 * property is exposed on — either they all name the same set, or none of them
 * names one and the interface's own [Exposed] decides.
 *
 * The rule is stated over the whole interface, so it is checked through
 * `validateInterface`.
 */
import { describe, expect, test } from "vitest";
import {
  Exposed,
  validateInterface,
  type Interface,
  type OperationExtendedAttributes,
} from "lib/webidl";

import {
  makeAttribute,
  makeOperation,
} from "../../../02-idl/05-idl-members/utils";
import {
  makeDOMStringType,
  makeLongType,
} from "../../../02-idl/13-idl-types/utils";

function makeInterface(overrides: Partial<Interface> = {}): Interface {
  return {
    identifier: "Example",
    extendedAttributes: { [Exposed]: "*" },
    inherit: null,
    staticMembers: {},
    behaviors: {},
    members: {},
    ...overrides,
  };
}

function makeOverloads(
  first: OperationExtendedAttributes = {},
  second: OperationExtendedAttributes = {},
) {
  return [
    makeOperation({
      identifier: "f",
      argumentTypes: [makeLongType()],
      extendedAttributes: first,
    }),
    makeOperation({
      identifier: "f",
      argumentTypes: [makeDOMStringType()],
      extendedAttributes: second,
    }),
  ];
}

describe("validateInterface - [Exposed] on overloaded operations", () => {
  test("does not throw when no overload declares it", () => {
    const iface = makeInterface({ members: { f: makeOverloads() } });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("does not throw when every overload declares the same exposure set", () => {
    const iface = makeInterface({
      members: {
        f: makeOverloads({ [Exposed]: "Window" }, { [Exposed]: "Window" }),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });

  test("throws when only one overload declares it", () => {
    const iface = makeInterface({
      members: { f: makeOverloads({ [Exposed]: "Window" }) },
    });

    expect(() => validateInterface(iface)).toThrow(/\[Exposed\]/);
  });

  test("throws when the overloads declare different exposure sets", () => {
    const iface = makeInterface({
      members: {
        f: makeOverloads({ [Exposed]: "Window" }, { [Exposed]: "Worker" }),
      },
    });

    expect(() => validateInterface(iface)).toThrow(/identically on all/);
  });

  test("applies to overloaded static operations as well", () => {
    const [one, two] = makeOverloads({ [Exposed]: "Window" });
    one!.keywords.add("static");
    two!.keywords.add("static");
    const iface = makeInterface({ staticMembers: { f: [one!, two!] } });

    expect(() => validateInterface(iface)).toThrow(/\[Exposed\]/);
  });

  test("says nothing about members that are not operations", () => {
    // An attribute carries [Exposed] of its own, and the rule is about the
    // overloads of one operation identifier, so neither is compared with it.
    const iface = makeInterface({
      members: {
        f: makeOverloads({ [Exposed]: "Window" }, { [Exposed]: "Window" }),
        attr: makeAttribute({
          type: makeLongType(),
          identifier: "attr",
          extendedAttributes: { [Exposed]: "Worker" },
        }),
      },
    });

    expect(() => validateInterface(iface)).not.toThrow();
  });
});
