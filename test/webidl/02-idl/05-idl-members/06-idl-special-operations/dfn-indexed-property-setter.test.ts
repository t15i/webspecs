/**
 * @see https://webidl.spec.whatwg.org/#dfn-indexed-property-setter
 *
 * `validateIndexedPropertySetter` performs the argument-shape check for the
 * indexed-setter variety: an "unsigned long" argument followed by a value
 * argument.
 */
import { describe, expect, test } from "vitest";
import { validateIndexedPropertySetter } from "lib/webidl";

import {
  makeDOMStringType,
  makeLongType,
  makeUnsignedLongType,
} from "../../13-idl-types/utils";
import { makeOperation } from "../utils";

describe("validateIndexedPropertySetter", () => {
  test('does not throw for an "unsigned long" argument and a value argument', () => {
    const op = makeOperation({
      keywords: ["setter"],
      argumentTypes: [makeUnsignedLongType(), makeLongType()],
    });

    expect(() => validateIndexedPropertySetter(op)).not.toThrow();
  });

  test("throws TypeError with a single argument", () => {
    const op = makeOperation({
      keywords: ["setter"],
      argumentTypes: [makeUnsignedLongType()],
    });

    expect(() => validateIndexedPropertySetter(op)).toThrow(TypeError);
  });

  test("throws TypeError with three arguments", () => {
    const op = makeOperation({
      keywords: ["setter"],
      argumentTypes: [makeUnsignedLongType(), makeLongType(), makeLongType()],
    });

    expect(() => validateIndexedPropertySetter(op)).toThrow(TypeError);
  });

  test('throws TypeError when the first argument is a "DOMString" (that is a named setter)', () => {
    const op = makeOperation({
      keywords: ["setter"],
      argumentTypes: [makeDOMStringType(), makeLongType()],
    });

    expect(() => validateIndexedPropertySetter(op)).toThrow(TypeError);
  });
});
