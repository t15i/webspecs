/**
 * @see https://webidl.spec.whatwg.org/#js-record
 *
 *   1. If O is not an Object, throw a TypeError.
 *   2. Let result be a new empty instance of record\<K, V\>.
 *   3. Let keys be ? O.[[OwnPropertyKeys]]().
 *   4. For each key of keys:
 *      1. Let desc be ? O.[[GetOwnProperty]](key).
 *      2. If desc is not undefined and desc.[[Enumerable]] is true:
 *         1. Let typedKey be key converted to K.
 *         2. Let value be ? Get(O, key).
 *         3. Let typedValue be value converted to V.
 *         4. Set result[typedKey] to typedValue.
 *   5. Return result.
 */
import { describe, expect, test } from "vitest";

import {
  makeDOMStringType,
  makeDoubleType,
  makeRecordType,
} from "../../../02-idl/13-idl-types/utils";

describe("asRecord - basic", () => {
  const T = makeRecordType(makeDOMStringType(), makeDoubleType());

  test("converts a plain object's own enumerable string properties", () => {
    expect(T({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });

  test("preserves declaration order for own keys", () => {
    expect(Object.keys(T({ b: 1, a: 2 }))).toEqual(["b", "a"]);
  });

  test("ignores non-enumerable own properties", () => {
    const obj: Record<string, unknown> = {};
    Object.defineProperty(obj, "hidden", { value: 7, enumerable: false });
    obj["shown"] = 5;
    expect(T(obj)).toEqual({ shown: 5 });
  });

  test("ignores inherited (prototype) properties", () => {
    const proto = { inherited: 9 };
    const obj = Object.create(proto) as Record<string, unknown>;
    obj["own"] = 1;
    expect(T(obj)).toEqual({ own: 1 });
  });

  test("each value is converted via V", () => {
    expect(T({ a: "5", b: true })).toEqual({ a: 5, b: 1 });
  });

  test("throws TypeError for non-Object V", () => {
    expect(() => T(null)).toThrow(TypeError);
    expect(() => T(undefined)).toThrow(TypeError);
    expect(() => T(42)).toThrow(TypeError);
    expect(() => T("x")).toThrow(TypeError);
  });

  test("throws TypeError when an inner value conversion fails", () => {
    expect(() => T({ a: "x" })).toThrow(TypeError);
  });
});

describe("asRecord - symbol-keyed properties", () => {
  test("a Symbol own key with K = DOMString throws (ToString of Symbol)", () => {
    const T = makeRecordType(makeDOMStringType(), makeDoubleType());
    const obj = { [Symbol("k")]: 1, a: 2 };
    // Whether the Symbol key is reached first or last depends on
    // Reflect.ownKeys ordering: string keys come before symbol keys.
    // After processing "a", the symbol key must trigger TypeError.
    expect(() => T(obj)).toThrow(TypeError);
  });
});
