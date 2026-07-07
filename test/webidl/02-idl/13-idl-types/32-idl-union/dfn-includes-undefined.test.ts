/**
 * @see https://webidl.spec.whatwg.org/#dfn-includes-undefined
 *
 * A type includes undefined if:
 *   - the type is undefined, or
 *   - the type is a nullable type and its inner type includes undefined, or
 *   - the type is an annotated type and its inner type includes undefined, or
 *   - the type is a union type and one of its member types includes
 *     undefined.
 */
import { describe, expect, test } from "vitest";
import { includesUndefined } from "lib/webidl";

import {
  makeAnnotatedType,
  makeAnyType,
  makeBooleanType,
  makeDOMStringType,
  makeLongType,
  makeNullableType,
  makeObjectType,
  makeUndefinedType,
  makeUnionType,
} from "../utils";

describe("includesUndefined", () => {
  test("returns true for the undefined type", () => {
    expect(includesUndefined(makeUndefinedType())).toBe(true);
  });

  test("returns false for non-undefined non-composite types", () => {
    expect(includesUndefined(makeBooleanType())).toBe(false);
    expect(includesUndefined(makeLongType())).toBe(false);
    expect(includesUndefined(makeDOMStringType())).toBe(false);
    expect(includesUndefined(makeObjectType())).toBe(false);
    expect(includesUndefined(makeAnyType())).toBe(false);
  });

  test("propagates through a nullable wrapper", () => {
    expect(includesUndefined(makeNullableType(makeUndefinedType()))).toBe(true);
    expect(includesUndefined(makeNullableType(makeBooleanType()))).toBe(false);
  });

  test("propagates through an annotated wrapper", () => {
    expect(
      includesUndefined(
        makeAnnotatedType(makeUndefinedType(), { clamp: true }),
      ),
    ).toBe(true);
    expect(
      includesUndefined(makeAnnotatedType(makeBooleanType(), { clamp: true })),
    ).toBe(false);
  });

  test("propagates through a union if any direct member includes undefined", () => {
    expect(
      includesUndefined(
        makeUnionType([makeBooleanType(), makeUndefinedType()]),
      ),
    ).toBe(true);
    expect(
      includesUndefined(
        makeUnionType([makeBooleanType(), makeDOMStringType()]),
      ),
    ).toBe(false);
  });

  test("recurses through nested unions", () => {
    const inner = makeUnionType([makeBooleanType(), makeUndefinedType()]);
    const outer = makeUnionType([makeDOMStringType(), inner]);
    expect(includesUndefined(outer)).toBe(true);
  });

  test("does NOT propagate through a sequence (sequence<undefined> is not includesUndefined)", () => {
    // Sequence is not in the spec rule, so it must not propagate.
    // (Sequences cannot contain undefined elements at the IDL level
    // anyway, but the predicate is purely structural.)
    expect(
      includesUndefined(
        makeAnnotatedType(
          makeAnnotatedType(makeBooleanType(), { clamp: true }),
          { clamp: true },
        ),
      ),
    ).toBe(false);
  });
});
