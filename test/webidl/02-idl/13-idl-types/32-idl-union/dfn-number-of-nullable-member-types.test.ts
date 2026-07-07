/**
 * @see https://webidl.spec.whatwg.org/#dfn-number-of-nullable-member-types
 *
 * Spec algorithm:
 *   1. Let T be the union type.
 *   2. Initialize n to 0.
 *   3. For each member type U of T:
 *      1. If U is a nullable type, then:
 *         1. Set n to n + 1.
 *         2. Set U to be the inner type of U.
 *      2. If U is a union type, then:
 *         1. Let m be the number of nullable member types of U.
 *         2. Set n to n + m.
 *   4. Return n.
 */
import { describe, expect, test } from "vitest";
import {
  getNumberOfNullableMemberTypes,
  validateNumberOfNullableMemberTypes,
} from "lib/webidl";

import {
  makeBooleanType,
  makeDictionaryType,
  makeDOMStringType,
  makeLongType,
  makeNullableType,
  makeUnionType,
} from "../utils";

describe("getNumberOfNullableMemberTypes", () => {
  test("0 when the union has no nullable members", () => {
    const union = makeUnionType([makeBooleanType(), makeDOMStringType()]);
    expect(getNumberOfNullableMemberTypes(union)).toBe(0);
  });

  test("1 when the union has a single direct nullable member", () => {
    const union = makeUnionType([
      makeNullableType(makeBooleanType()),
      makeDOMStringType(),
    ]);
    expect(getNumberOfNullableMemberTypes(union)).toBe(1);
  });

  test("2 when the union has two direct nullable members", () => {
    const union = makeUnionType([
      makeNullableType(makeBooleanType()),
      makeNullableType(makeDOMStringType()),
    ]);
    expect(getNumberOfNullableMemberTypes(union)).toBe(2);
  });

  test("recurses into nested unions and adds their counts", () => {
    const inner = makeUnionType([
      makeNullableType(makeBooleanType()),
      makeLongType(),
    ]);
    const outer = makeUnionType([makeDOMStringType(), inner]);
    expect(getNumberOfNullableMemberTypes(outer)).toBe(1);
  });

  test("counts both a top-level nullable and a nested-union nullable", () => {
    const inner = makeUnionType([
      makeNullableType(makeBooleanType()),
      makeLongType(),
    ]);
    const outer = makeUnionType([makeNullableType(makeDOMStringType()), inner]);
    expect(getNumberOfNullableMemberTypes(outer)).toBe(2);
  });

  test("recurses through a nullable whose inner is itself a union with a nullable", () => {
    // Per spec step 3.1.2: after counting a nullable, set U to its inner
    // type. Then step 3.2 checks if (the now-inner) U is a union.
    const inner = makeUnionType([
      makeNullableType(makeBooleanType()),
      makeLongType(),
    ]);
    const union = makeUnionType([makeNullableType(inner)]);
    expect(getNumberOfNullableMemberTypes(union)).toBe(2);
  });
});

/**
 * Spec rule: the number of nullable member types of a union type must be
 * 0 or 1. If it is 1, the union must not have a dictionary type in its
 * flattened member types.
 */
describe("validateNumberOfNullableMemberTypes", () => {
  test("does not throw when the count is 0", () => {
    const union = makeUnionType([makeBooleanType(), makeDOMStringType()]);
    expect(() => validateNumberOfNullableMemberTypes(union)).not.toThrow();
  });

  test("does not throw when the count is 1 and no dictionary is present", () => {
    const union = makeUnionType([
      makeNullableType(makeBooleanType()),
      makeDOMStringType(),
    ]);
    expect(() => validateNumberOfNullableMemberTypes(union)).not.toThrow();
  });

  test("throws TypeError when the count is 2 (two direct nullable members)", () => {
    const union = makeUnionType([
      makeNullableType(makeBooleanType()),
      makeNullableType(makeDOMStringType()),
    ]);
    expect(() => validateNumberOfNullableMemberTypes(union)).toThrow(TypeError);
  });

  test("throws TypeError when the count is 2 (top-level + nested nullable)", () => {
    const inner = makeUnionType([
      makeNullableType(makeBooleanType()),
      makeLongType(),
    ]);
    const outer = makeUnionType([makeNullableType(makeDOMStringType()), inner]);
    expect(() => validateNumberOfNullableMemberTypes(outer)).toThrow(TypeError);
  });

  test("throws TypeError when the count is 1 and a dictionary is in flattened member types", () => {
    const union = makeUnionType([
      makeNullableType(makeBooleanType()),
      makeDictionaryType(),
    ]);
    expect(() => validateNumberOfNullableMemberTypes(union)).toThrow(TypeError);
  });

  test("does not throw when the count is 0 even with a dictionary in flattened member types", () => {
    const union = makeUnionType([makeDOMStringType(), makeDictionaryType()]);
    expect(() => validateNumberOfNullableMemberTypes(union)).not.toThrow();
  });
});
