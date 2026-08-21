/**
 * @see https://webidl.spec.whatwg.org/#dfn-member
 *
 * `validateMemberSlot` dispatches to the validator for the kind the slot holds —
 * an attribute, or a list of operations or constructor operations — and rejects
 * anything else. Errors raised by the per-kind validators propagate unchanged.
 *
 * A slot holds every operation overloaded under one identifier, so all of them
 * are validated, and the list itself must be a well-formed one: non-empty, of a
 * single kind, and declaring one identifier.
 */
import { describe, expect, test } from "vitest";
import {
  iterateMemberSlots,
  iterateMembers,
  validateMemberSlot,
  type MemberSlot,
} from "lib/webidl";

import { makeAttribute, makeConstructor, makeOperation } from "./utils";
import { makeDOMStringType, makeLongType } from "../13-idl-types/utils";

describe("validateMemberSlot", () => {
  test("does not throw for a valid attribute", () => {
    expect(() =>
      validateMemberSlot(makeAttribute({ type: makeDOMStringType() })),
    ).not.toThrow();
  });

  test("does not throw for a valid operation", () => {
    expect(() =>
      validateMemberSlot([makeOperation({ identifier: "operate" })]),
    ).not.toThrow();
  });

  test("propagates attribute validation errors", () => {
    expect(() =>
      validateMemberSlot(
        makeAttribute({ type: makeDOMStringType(), identifier: "1bad" }),
      ),
    ).toThrow(TypeError);
  });

  test("propagates operation validation errors", () => {
    expect(() =>
      validateMemberSlot([makeOperation({ identifier: "1bad" })]),
    ).toThrow(TypeError);
  });

  test("does not throw for a valid constructor operation", () => {
    expect(() => validateMemberSlot([makeConstructor({})])).not.toThrow();
  });

  test("propagates constructor operation validation errors", () => {
    expect(() =>
      validateMemberSlot([
        makeConstructor({
          arguments: [{ type: makeLongType(), identifier: "1bad" }],
        }),
      ]),
    ).toThrow(TypeError);
  });

  test("throws for a member of an unrecognised kind", () => {
    const bogus = { kind: "mystery", keywords: new Set<string>() };

    expect(() => validateMemberSlot(bogus as unknown as MemberSlot)).toThrow(
      TypeError,
    );
  });
});

describe("validateMemberSlot - overloads", () => {
  test("does not throw for a well-formed group of overloads", () => {
    expect(() =>
      validateMemberSlot([
        makeOperation({ identifier: "f", argumentTypes: [makeLongType()] }),
        makeOperation({ identifier: "f" }),
      ]),
    ).not.toThrow();
  });

  test("validates every overload of the group", () => {
    expect(() =>
      validateMemberSlot([
        makeOperation({ identifier: "f" }),
        makeOperation({ identifier: "1bad" }),
      ]),
    ).toThrow(TypeError);
  });

  test("throws for an empty group", () => {
    expect(() => validateMemberSlot([])).toThrow(/at least one operation/i);
  });

  test("throws when the group mixes operations of different kinds", () => {
    expect(() =>
      validateMemberSlot([
        makeOperation({ identifier: "f" }),
        makeConstructor({}),
      ] as unknown as MemberSlot),
    ).toThrow(/same kind/i);
  });

  test("throws when the overloads declare different identifiers", () => {
    expect(() =>
      validateMemberSlot([
        makeOperation({ identifier: "f" }),
        makeOperation({ identifier: "g" }),
      ]),
    ).toThrow(/must all declare it/i);
  });

  test("does not throw for a group of constructor overloads", () => {
    expect(() =>
      validateMemberSlot([
        makeConstructor({ argumentTypes: [makeLongType()] }),
        makeConstructor({}),
      ]),
    ).not.toThrow();
  });

  test("validates every constructor overload of the group", () => {
    expect(() =>
      validateMemberSlot([
        makeConstructor({}),
        makeConstructor({
          arguments: [{ type: makeLongType(), identifier: "1bad" }],
        }),
      ]),
    ).toThrow(TypeError);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#dfn-member
 *
 * The member table also carries the machinery of special operations under
 * symbol keys, and those are not members; both walks pass over them. A slot
 * holds every operation overloaded under one identifier, so `iterateMembers`
 * reports the identifier once per overload while `iterateMemberSlots` reports
 * it once with all of them.
 */
describe("iterateMemberSlots", () => {
  test("yields each slot with the identifier it is declared under", () => {
    const attribute = makeAttribute({
      type: makeDOMStringType(),
      identifier: "label",
    });
    const overloads = [
      makeOperation({ identifier: "f", argumentTypes: [makeLongType()] }),
      makeOperation({ identifier: "f" }),
    ];

    expect([...iterateMemberSlots({ label: attribute, f: overloads })]).toEqual(
      [
        ["label", attribute],
        ["f", overloads],
      ],
    );
  });

  test("passes over a symbol-keyed slot", () => {
    const marker = Symbol("marker");
    const attribute = makeAttribute({
      type: makeDOMStringType(),
      identifier: "label",
    });

    expect([
      ...iterateMemberSlots({
        [marker]: (() => undefined) as never,
        label: attribute,
      }),
    ]).toEqual([["label", attribute]]);
  });

  test("passes over a value that is not a member", () => {
    expect([
      ...iterateMemberSlots({ determinator: (() => true) as never }),
    ]).toEqual([]);
  });

  test("yields an empty slot, which is not a well-formed member", () => {
    // Filtering it out here would let `validateInterface` accept it silently.
    expect([...iterateMemberSlots({ f: [] })]).toEqual([["f", []]]);
  });
});

describe("iterateMembers", () => {
  test("yields every overload of a slot under the same identifier", () => {
    const one = makeOperation({
      identifier: "f",
      argumentTypes: [makeLongType()],
    });
    const two = makeOperation({ identifier: "f" });

    expect([...iterateMembers({ f: [one, two] })]).toEqual([
      ["f", one],
      ["f", two],
    ]);
  });

  test("yields an attribute once", () => {
    const attribute = makeAttribute({
      type: makeDOMStringType(),
      identifier: "label",
    });

    expect([...iterateMembers({ label: attribute })]).toEqual([
      ["label", attribute],
    ]);
  });
});
