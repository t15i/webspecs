/**
 * @see https://webidl.spec.whatwg.org/#dfn-indexed-property-getter
 *
 * `validateIndexedPropertyGetter` performs the argument-shape check for the
 * indexed-getter variety: exactly one argument, typed "unsigned long".
 */
import { describe, expect, test } from "vitest";
import { validateIndexedPropertyGetter } from "lib/webidl";

import {
  makeDOMStringType,
  makeUnsignedLongType,
} from "../../13-idl-types/utils";
import { makeOperation } from "../utils";

describe("validateIndexedPropertyGetter", () => {
  test('does not throw for a single "unsigned long" argument', () => {
    const op = makeOperation({
      keywords: ["getter"],
      argumentTypes: [makeUnsignedLongType()],
    });

    expect(() => validateIndexedPropertyGetter(op)).not.toThrow();
  });

  test("throws TypeError without arguments", () => {
    const op = makeOperation({ keywords: ["getter"] });

    expect(() => validateIndexedPropertyGetter(op)).toThrow(TypeError);
  });

  test("throws TypeError with two arguments", () => {
    const op = makeOperation({
      keywords: ["getter"],
      argumentTypes: [makeUnsignedLongType(), makeUnsignedLongType()],
    });

    expect(() => validateIndexedPropertyGetter(op)).toThrow(TypeError);
  });

  test('throws TypeError for a "DOMString" argument (that is a named getter)', () => {
    const op = makeOperation({
      keywords: ["getter"],
      argumentTypes: [makeDOMStringType()],
    });

    expect(() => validateIndexedPropertyGetter(op)).toThrow(TypeError);
  });
});
