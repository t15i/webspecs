/**
 * @see https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-setfunctionlength
 *
 * `setFunctionLength` (re)defines the `"length"` property of a function as
 * non-writable, non-enumerable and configurable.
 */
import { describe, expect, test } from "vitest";
import { setFunctionLength } from "lib/ecma";

describe("setFunctionLength", () => {
  test("defines length as a non-negative integer", () => {
    const f = (a: unknown, b: unknown): unknown => [a, b];
    setFunctionLength(f, 2);
    expect(f.length).toBe(2);
  });

  test("length is non-writable, non-enumerable and configurable", () => {
    const f = (): void => undefined;
    setFunctionLength(f, 0);
    expect(Object.getOwnPropertyDescriptor(f, "length")).toEqual({
      value: 0,
      writable: false,
      enumerable: false,
      configurable: true,
    });
  });

  test("accepts +∞", () => {
    const f = (): void => undefined;
    setFunctionLength(f, Infinity);
    expect(f.length).toBe(Infinity);
  });
});
