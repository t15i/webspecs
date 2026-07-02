/**
 * @see https://webidl.spec.whatwg.org/#dfn-union-member-type
 *
 * Spec rule: the any type must not be used as a union member type.
 */
import { describe, expect, test } from "vitest";
import { validateUnionMemberTypes } from "lib/webidl";

import {
  makeAnyType,
  makeBooleanType,
  makeDOMStringType,
  makeLongType,
  makeUnionType,
} from "../utils";

describe("validateUnionMemberTypes", () => {
  test("does not throw for members that do not include any", () => {
    expect(() =>
      validateUnionMemberTypes(
        makeUnionType([makeDOMStringType(), makeLongType()]),
      ),
    ).not.toThrow();
  });

  test("does not throw for a single non-any member", () => {
    expect(() =>
      validateUnionMemberTypes(makeUnionType([makeBooleanType()])),
    ).not.toThrow();
  });

  test("throws TypeError when any is used as a union member type", () => {
    expect(() =>
      validateUnionMemberTypes(
        makeUnionType([makeAnyType(), makeDOMStringType()]),
      ),
    ).toThrow(TypeError);
  });

  test("throws TypeError when any appears in any position", () => {
    expect(() =>
      validateUnionMemberTypes(makeUnionType([makeLongType(), makeAnyType()])),
    ).toThrow(TypeError);
  });
});
