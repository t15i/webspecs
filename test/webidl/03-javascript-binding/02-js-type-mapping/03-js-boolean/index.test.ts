/**
 * @see https://webidl.spec.whatwg.org/#js-boolean
 *
 *   1. Let x be the result of computing ToBoolean(V).
 *   2. Return the IDL boolean value that is the one that represents the
 *      same truth value as the JavaScript Boolean value x.
 */
import { describe, expect, test } from "vitest";

import { makeBooleanType } from "../../../02-idl/13-idl-types/utils";

describe("asBoolean", () => {
  const T = makeBooleanType();

  test.each([
    [true, true],
    [false, false],
    [1, true],
    [0, false],
    [-1, true],
    [NaN, false],
    [Infinity, true],
    [-0, false],
    ["", false],
    ["false", true], // ToBoolean of any non-empty string is true
    ["0", true],
    [null, false],
    [undefined, false],
    [{}, true],
    [[], true],
    [0n, false],
    [1n, true],
  ] as const)("ToBoolean(%s) is %s", (input, expected) => {
    expect(T(input)).toBe(expected);
  });

  test("Symbol coerces to true (any symbol is truthy)", () => {
    expect(T(Symbol("x"))).toBe(true);
  });
});
