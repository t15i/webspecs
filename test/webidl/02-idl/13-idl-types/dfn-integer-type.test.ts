/**
 * @see https://webidl.spec.whatwg.org/#dfn-integer-type
 *
 * The integer types are byte, octet, short, unsigned short, long,
 * unsigned long, long long and unsigned long long. Of these, only long and
 * unsigned long are currently modelled; `isIntegerType` narrows to them.
 */
import { describe, expect, test } from "vitest";
import { isIntegerType } from "lib/webidl";

import {
  makeBigIntType,
  makeDOMStringType,
  makeDoubleType,
  makeLongType,
  makeUnsignedLongType,
} from "./utils";

describe("isIntegerType", () => {
  test('returns true for the "long" type', () => {
    expect(isIntegerType(makeLongType())).toBe(true);
  });

  test('returns true for the "unsigned long" type', () => {
    expect(isIntegerType(makeUnsignedLongType())).toBe(true);
  });

  test('returns false for a non-integer numeric type ("double")', () => {
    expect(isIntegerType(makeDoubleType())).toBe(false);
  });

  test("returns false for the bigint type", () => {
    expect(isIntegerType(makeBigIntType())).toBe(false);
  });

  test("returns false for a non-numeric type (DOMString)", () => {
    expect(isIntegerType(makeDOMStringType())).toBe(false);
  });
});
