/**
 * @see https://webidl.spec.whatwg.org/#js-interface
 *
 *   1. If V implements I, then return the IDL interface type value that
 *      represents a reference to that platform object.
 *   2. Throw a TypeError.
 */
import { describe, expect, test } from "vitest";

import { makeInterfaceType } from "../../../02-idl/13-idl-types/utils";

class Foo {}
class Bar {}
class FooChild extends Foo {}

describe("asInterfaceType", () => {
  const T = makeInterfaceType(Foo);

  test("returns the value when it is an instance of the interface ctor", () => {
    const v = new Foo();
    expect(T(v)).toBe(v);
  });

  test("returns the value when it is an instance of a subclass", () => {
    const v = new FooChild();
    expect(T(v)).toBe(v);
  });

  test("throws TypeError for an instance of an unrelated class", () => {
    expect(() => T(new Bar())).toThrow(TypeError);
  });

  test.each([
    ["null", null],
    ["undefined", undefined],
    ["a number", 42],
    ["a string", "Foo"],
    ["a plain object", {}],
    ["an array", []],
  ] as const)("throws TypeError for %s", (_, value) => {
    expect(() => T(value)).toThrow(TypeError);
  });
});
