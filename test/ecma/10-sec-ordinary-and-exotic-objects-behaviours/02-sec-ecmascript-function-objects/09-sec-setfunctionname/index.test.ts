/**
 * @see https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-setfunctionname
 *
 * `setFunctionName` (re)defines the `"name"` property of a function. In a JS
 * runtime a function already owns a configurable `"name"`, so the operation
 * simply redefines it as non-writable, non-enumerable and configurable.
 */
import { describe, expect, test } from "vitest";
import { setFunctionName } from "lib/ecma";

describe("setFunctionName", () => {
  test("defines name from a String", () => {
    const f = (): void => undefined;
    setFunctionName(f, "foo");
    expect(f.name).toBe("foo");
  });

  test("name is non-writable, non-enumerable and configurable", () => {
    const f = (): void => undefined;
    setFunctionName(f, "foo");
    expect(Object.getOwnPropertyDescriptor(f, "name")).toEqual({
      value: "foo",
      writable: false,
      enumerable: false,
      configurable: true,
    });
  });

  test("wraps a Symbol description in brackets", () => {
    const f = (): void => undefined;
    setFunctionName(f, Symbol("iterator"));
    expect(f.name).toBe("[iterator]");
  });

  test("uses the empty String for a Symbol without a description", () => {
    const f = (): void => undefined;
    setFunctionName(f, Symbol());
    expect(f.name).toBe("");
  });

  test("prepends prefix separated by a space", () => {
    const f = (): void => undefined;
    setFunctionName(f, "size", "get");
    expect(f.name).toBe("get size");
  });

  test("prepends prefix to a Symbol-derived name", () => {
    const f = (): void => undefined;
    setFunctionName(f, Symbol("iterator"), "get");
    expect(f.name).toBe("get [iterator]");
  });
});
