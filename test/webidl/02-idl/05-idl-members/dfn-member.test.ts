/**
 * @see https://webidl.spec.whatwg.org/#dfn-member
 *
 * `validateMember` dispatches to the validator for the member's kind — attribute,
 * operation, or constructor operation — and rejects any other kind. Errors raised
 * by the per-kind validators propagate unchanged.
 *
 * A member slot may hold several operations overloaded under one identifier, in
 * which case every one of them is validated, and the group itself must be a
 * well-formed one: non-empty, of a single kind, and declaring one identifier.
 */
import { describe, expect, test } from "vitest";
import { validateMember, type Member } from "lib/webidl";

import { makeAttribute, makeConstructor, makeOperation } from "./utils";
import { makeDOMStringType, makeLongType } from "../13-idl-types/utils";

describe("validateMember", () => {
  test("does not throw for a valid attribute", () => {
    expect(() =>
      validateMember(makeAttribute({ type: makeDOMStringType() })),
    ).not.toThrow();
  });

  test("does not throw for a valid operation", () => {
    expect(() =>
      validateMember(makeOperation({ identifier: "operate" })),
    ).not.toThrow();
  });

  test("propagates attribute validation errors", () => {
    expect(() =>
      validateMember(
        makeAttribute({ type: makeDOMStringType(), identifier: "1bad" }),
      ),
    ).toThrow(TypeError);
  });

  test("propagates operation validation errors", () => {
    expect(() => validateMember(makeOperation({ identifier: "1bad" }))).toThrow(
      TypeError,
    );
  });

  test("does not throw for a valid constructor operation", () => {
    expect(() => validateMember(makeConstructor({}))).not.toThrow();
  });

  test("propagates constructor operation validation errors", () => {
    expect(() =>
      validateMember(
        makeConstructor({
          arguments: [{ type: makeLongType(), identifier: "1bad" }],
        }),
      ),
    ).toThrow(TypeError);
  });

  test("throws for a member of an unrecognised kind", () => {
    const bogus = { kind: "mystery", keywords: new Set<string>() };

    expect(() => validateMember(bogus as unknown as Member)).toThrow(TypeError);
  });
});

describe("validateMember - overloads", () => {
  test("does not throw for a well-formed group of overloads", () => {
    expect(() =>
      validateMember([
        makeOperation({ identifier: "f", argumentTypes: [makeLongType()] }),
        makeOperation({ identifier: "f" }),
      ]),
    ).not.toThrow();
  });

  test("validates every overload of the group", () => {
    expect(() =>
      validateMember([
        makeOperation({ identifier: "f" }),
        makeOperation({ identifier: "1bad" }),
      ]),
    ).toThrow(TypeError);
  });

  test("throws for an empty group", () => {
    expect(() => validateMember([])).toThrow(/at least one operation/i);
  });

  test("throws when the group mixes operations of different kinds", () => {
    expect(() =>
      validateMember([
        makeOperation({ identifier: "f" }),
        makeConstructor({}),
      ] as unknown as Member),
    ).toThrow(/same kind/i);
  });

  test("throws when the overloads declare different identifiers", () => {
    expect(() =>
      validateMember([
        makeOperation({ identifier: "f" }),
        makeOperation({ identifier: "g" }),
      ]),
    ).toThrow(/must all declare it/i);
  });

  test("does not throw for a group of constructor overloads", () => {
    expect(() =>
      validateMember([
        makeConstructor({ argumentTypes: [makeLongType()] }),
        makeConstructor({}),
      ]),
    ).not.toThrow();
  });

  test("validates every constructor overload of the group", () => {
    expect(() =>
      validateMember([
        makeConstructor({}),
        makeConstructor({
          arguments: [{ type: makeLongType(), identifier: "1bad" }],
        }),
      ]),
    ).toThrow(TypeError);
  });
});
