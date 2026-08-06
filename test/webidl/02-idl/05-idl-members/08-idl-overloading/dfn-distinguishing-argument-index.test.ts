/**
 * @see https://webidl.spec.whatwg.org/#dfn-distinguishing-argument-index
 *
 * Given entries of an effective overload set that all share a type-list size,
 * the distinguishing argument index is the lowest index `i` at which the types
 * of every pair of entries are distinguishable. If no such index exists (or the
 * type lists are empty) there is no distinguishing argument index and the
 * algorithm throws.
 *
 * Distinguishability here follows the § 2.5.10.1 table: long and unsigned long
 * share the numeric category (indistinguishable), whereas a numeric and a string
 * type are distinguishable.
 */
import { describe, expect, test } from "vitest";
import {
  getDistinguishingArgumentIndex,
  type OperationEffectiveOverloadSet,
  type Type,
} from "lib/webidl";

import { makeOperation } from "../utils";
import {
  makeDOMStringType,
  makeLongType,
  makeUnsignedLongType,
} from "../../13-idl-types/utils";

/**
 * Builds an effective overload set from a list of type lists. Only the type
 * lists matter to the algorithm, so every entry shares one dummy callable.
 */
function overloadSet(...typeLists: Type[][]): OperationEffectiveOverloadSet {
  const callable = makeOperation({ identifier: "op" });
  return new Set(
    typeLists.map((typeList) => [
      callable,
      typeList,
      typeList.map(() => "required" as const),
    ]),
  ) as unknown as OperationEffectiveOverloadSet;
}

describe("getDistinguishingArgumentIndex - single entry", () => {
  test("is index 0 for a non-empty type list", () => {
    expect(getDistinguishingArgumentIndex(overloadSet([makeLongType()]))).toBe(
      0,
    );
  });

  test("throws for an empty type list", () => {
    expect(() => getDistinguishingArgumentIndex(overloadSet([]))).toThrow(
      TypeError,
    );
  });
});

describe("getDistinguishingArgumentIndex - multiple entries", () => {
  test("is the first index where the argument types are pairwise distinguishable", () => {
    // long vs DOMString differ at index 0 (numeric vs string).
    const set = overloadSet([makeLongType()], [makeDOMStringType()]);

    expect(getDistinguishingArgumentIndex(set)).toBe(0);
  });

  test("skips an index where a pair is indistinguishable and uses a later one", () => {
    // Both entries take `long` at index 0 (indistinguishable), but differ at
    // index 1 (long vs DOMString).
    const set = overloadSet(
      [makeLongType(), makeLongType()],
      [makeLongType(), makeDOMStringType()],
    );

    expect(getDistinguishingArgumentIndex(set)).toBe(1);
  });

  test("chooses the lowest distinguishing index when several qualify", () => {
    // Entries differ at both index 0 (long vs DOMString) and index 1; the lowest
    // must win.
    const set = overloadSet(
      [makeLongType(), makeLongType()],
      [makeDOMStringType(), makeDOMStringType()],
    );

    expect(getDistinguishingArgumentIndex(set)).toBe(0);
  });

  test("throws when no index distinguishes every pair", () => {
    // long and unsigned long are both numeric, so no argument index tells the
    // two overloads apart.
    const set = overloadSet([makeLongType()], [makeUnsignedLongType()]);

    expect(() => getDistinguishingArgumentIndex(set)).toThrow(TypeError);
  });
});
