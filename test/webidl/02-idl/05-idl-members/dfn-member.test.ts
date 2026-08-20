/**
 * @see https://webidl.spec.whatwg.org/#dfn-member
 *
 * `validateMember` dispatches to the validator for the member's kind — attribute,
 * operation, or constructor operation — and rejects any other kind. Errors raised
 * by the per-kind validators propagate unchanged.
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
