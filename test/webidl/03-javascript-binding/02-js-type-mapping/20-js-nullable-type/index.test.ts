/**
 * @see https://webidl.spec.whatwg.org/#js-nullable-type
 *
 * A JavaScript value V is converted to an IDL nullable type T? value
 * (where T is the inner type) as follows:
 *
 *   1. If V is not an Object, and the conversion is being performed due
 *      to V being assigned to an attribute whose type is a nullable
 *      callback function annotated with [LegacyTreatNonObjectAsNull],
 *      then return null.
 *   2. Otherwise, if V is undefined and T includes undefined, return
 *      the unique undefined value.
 *   3. Otherwise, if V is null or undefined, then return null.
 *   4. Otherwise, return the result of converting V using the inner
 *      type T.
 */
import { describe, expect, test } from "vitest";

import {
  makeBooleanType,
  makeDOMStringType,
  makeLongType,
  makeNullableType,
  makeUndefinedType,
  makeUnionType,
} from "../../../02-idl/13-idl-types/utils";

describe("asNullable - V is null or undefined", () => {
  test("V is null -> null (when inner does not include undefined)", () => {
    const T = makeNullableType(makeBooleanType());
    expect(T(null)).toBe(null);
  });

  test("V is undefined -> null (when inner does not include undefined)", () => {
    const T = makeNullableType(makeBooleanType());
    expect(T(undefined)).toBe(null);
  });

  test("V is undefined AND inner type IS undefined -> returns undefined", () => {
    const T = makeNullableType(makeUndefinedType());
    expect(T(undefined)).toBe(undefined);
  });

  test("V is undefined AND inner is a union including undefined -> returns undefined", () => {
    const T = makeNullableType(
      makeUnionType([makeBooleanType(), makeUndefinedType()]),
    );
    expect(T(undefined)).toBe(undefined);
  });

  test("V is null AND inner is a union including undefined -> null", () => {
    // Step 2 only fires when V is undefined; null falls through to step 3.
    const T = makeNullableType(
      makeUnionType([makeBooleanType(), makeUndefinedType()]),
    );
    expect(T(null)).toBe(null);
  });
});

describe("asNullable - inner type conversion", () => {
  test("delegates to inner boolean type", () => {
    const T = makeNullableType(makeBooleanType());
    expect(T(true)).toBe(true);
    expect(T(0)).toBe(false);
    expect(T("x")).toBe(true);
  });

  test("delegates to inner long type", () => {
    const T = makeNullableType(makeLongType());
    expect(T(42)).toBe(42);
    expect(T("7")).toBe(7);
  });

  test("delegates to inner DOMString type", () => {
    const T = makeNullableType(makeDOMStringType());
    expect(T(42)).toBe("42");
    expect(T("x")).toBe("x");
  });
});
