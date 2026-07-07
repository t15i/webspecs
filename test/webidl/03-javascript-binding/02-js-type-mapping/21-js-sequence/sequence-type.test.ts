/**
 * @see https://webidl.spec.whatwg.org/#js-sequence
 *
 *   1. If V is not an Object, throw a TypeError.
 *   2. Let method be ? GetMethod(V, %Symbol.iterator%).
 *   3. If method is undefined, throw a TypeError.
 *   4. Return the result of creating a sequence from V and method.
 *
 * Note (per spec): "Object" includes functions; only primitive values
 * (including null and undefined) are non-objects.
 */
import { describe, expect, test } from "vitest";

import {
  makeLongType,
  makeSequenceType,
} from "../../../02-idl/13-idl-types/utils";

describe("asSequence - iterable inputs", () => {
  const T = makeSequenceType(makeLongType());

  test("array -> sequence", () => {
    expect(T([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test("empty array -> empty sequence", () => {
    expect(T([])).toEqual([]);
  });

  test("array of mixed values converts each via inner T", () => {
    expect(T(["1", 2.7, true])).toEqual([1, 2, 1]);
  });

  test("generator -> sequence", () => {
    function* g(): Generator<number> {
      yield 10;
      yield 20;
    }
    expect(T(g())).toEqual([10, 20]);
  });

  test("Set -> sequence", () => {
    expect(T(new Set([3, 1, 4]))).toEqual([3, 1, 4]);
  });

  test("Map -> sequence of [k, v] entries (each converted via inner T)", () => {
    // The library converts Map entries [k, v] arrays via T; with
    // T = long, ToNumber([0,'a']) = ToNumber("0,a") = NaN -> 0.
    expect(T(new Map([[1, 2]]))).toEqual([0]);
  });

  test("object with own [Symbol.iterator] method", () => {
    const obj = {
      [Symbol.iterator](): Iterator<number> {
        let i = 0;
        return {
          next(): IteratorResult<number> {
            return i < 3
              ? { value: i++, done: false }
              : { value: undefined, done: true };
          },
        };
      },
    };
    expect(T(obj)).toEqual([0, 1, 2]);
  });
});

describe("asSequence - invalid inputs", () => {
  const T = makeSequenceType(makeLongType());

  test.each([
    ["null", null],
    ["undefined", undefined],
    ["a number", 42],
    ["a boolean", true],
    ["a bigint", 1n],
    ["a symbol", Symbol("x")],
  ] as const)("throws TypeError for %s (V is not an Object)", (_, value) => {
    expect(() => T(value)).toThrow(TypeError);
  });

  test("throws TypeError for an object without Symbol.iterator", () => {
    expect(() => T({ a: 1 })).toThrow(TypeError);
  });

  test("throws TypeError when Symbol.iterator is not callable", () => {
    expect(() => T({ [Symbol.iterator]: 42 })).toThrow(TypeError);
  });
});

describe("asSequence - JavaScript strings", () => {
  const T = makeSequenceType(makeLongType());

  test("primitive string throws (not an Object)", () => {
    // Spec step 1 requires V to be an Object; strings are primitives.
    expect(() => T("abc")).toThrow(TypeError);
  });
});

describe("asSequence - functions with Symbol.iterator (spec accepts; library may not)", () => {
  const T = makeSequenceType(makeLongType());

  test("a callable object with Symbol.iterator should be accepted per spec", () => {
    const fn = function gen(): unknown {
      return undefined;
    };
    (fn as unknown as { [Symbol.iterator]: () => Iterator<number> })[
      Symbol.iterator
    ] = function* (): Generator<number> {
      yield 1;
      yield 2;
    };
    expect(T(fn)).toEqual([1, 2]);
  });
});
