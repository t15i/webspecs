/**
 * @see https://webidl.spec.whatwg.org/#dfn-includes-a-nullable-type
 *
 * A type includes a nullable type if:
 *   - the type is a nullable type, or
 *   - the type is an annotated type and its inner type is a nullable type, or
 *   - the type is a union type and its number of nullable member types is 1.
 */
import { describe, expect, test } from "vitest";
import { includesNullableType } from "lib/webidl";

import {
  makeAnnotatedType,
  makeAnyType,
  makeBooleanType,
  makeDictionaryType,
  makeDOMStringType,
  makeLongType,
  makeNullableType,
  makeObjectType,
  makeSequenceType,
  makeUndefinedType,
  makeUnionType,
} from "../utils";

describe("includesNullableType", () => {
  test("returns true for a nullable type", () => {
    expect(includesNullableType(makeNullableType(makeBooleanType()))).toBe(
      true,
    );
  });

  test("returns true for an annotated type whose inner is nullable", () => {
    expect(
      includesNullableType(
        makeAnnotatedType(makeNullableType(makeDOMStringType()), {
          legacyNullToEmptyString: true,
        }),
      ),
    ).toBe(true);
  });

  test("returns false for an annotated type whose inner is non-nullable", () => {
    expect(
      includesNullableType(
        makeAnnotatedType(makeDOMStringType(), {
          legacyNullToEmptyString: true,
        }),
      ),
    ).toBe(false);
  });

  test("returns true for a union with exactly one nullable member", () => {
    const union = makeUnionType([
      makeNullableType(makeBooleanType()),
      makeDOMStringType(),
    ]);
    expect(includesNullableType(union)).toBe(true);
  });

  test("returns false for a union with no nullable members", () => {
    const union = makeUnionType([makeDOMStringType(), makeLongType()]);
    expect(includesNullableType(union)).toBe(false);
  });

  test("returns false for a union with two nullable members (count !== 1)", () => {
    // Two top-level nullables - the count is 2, not 1.
    const union = makeUnionType([
      makeNullableType(makeBooleanType()),
      makeNullableType(makeDOMStringType()),
    ]);
    expect(includesNullableType(union)).toBe(false);
  });

  test("returns true for a union with one nullable inside a nested union", () => {
    const inner = makeUnionType([
      makeNullableType(makeBooleanType()),
      makeLongType(),
    ]);
    const outer = makeUnionType([makeDOMStringType(), inner]);
    expect(includesNullableType(outer)).toBe(true);
  });

  test("returns false for plain non-nullable primitives", () => {
    expect(includesNullableType(makeBooleanType())).toBe(false);
    expect(includesNullableType(makeLongType())).toBe(false);
    expect(includesNullableType(makeDOMStringType())).toBe(false);
    expect(includesNullableType(makeObjectType())).toBe(false);
    expect(includesNullableType(makeUndefinedType())).toBe(false);
    expect(includesNullableType(makeAnyType())).toBe(false);
    expect(includesNullableType(makeDictionaryType())).toBe(false);
    expect(includesNullableType(makeSequenceType(makeLongType()))).toBe(false);
  });
});
