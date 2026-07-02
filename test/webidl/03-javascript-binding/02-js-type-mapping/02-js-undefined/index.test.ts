/**
 * @see https://webidl.spec.whatwg.org/#js-undefined
 *
 * "A JavaScript value V is converted to an IDL undefined value by
 * returning the unique undefined value, ignoring V."
 */
import { describe, expect, test } from "vitest";

import { makeUndefinedType } from "../../../02-idl/13-idl-types/utils";

describe("asUndefined", () => {
  const T = makeUndefinedType();

  test("returns undefined for undefined", () => {
    expect(T(undefined)).toBe(undefined);
  });

  test("returns undefined for null", () => {
    expect(T(null)).toBe(undefined);
  });

  test.each([
    ["a number", 42],
    ["a string", "hello"],
    ["a boolean", true],
    ["an object", { a: 1 }],
    ["an array", [1, 2, 3]],
    ["a bigint", 1n],
    ["a symbol", Symbol("x")],
  ] as const)("ignores V (%s) and returns undefined", (_, value) => {
    expect(T(value)).toBe(undefined);
  });
});
