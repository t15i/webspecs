/**
 * @see https://webidl.spec.whatwg.org/#idl-special-operations
 *
 * Spec rules exercised here:
 *   - A special operation is one declared with a getter, setter, or
 *     deleter keyword; the keywords are mutually exclusive and special
 *     operations must not be static.
 *   - Getters must take a single "unsigned long" (indexed) or
 *     "DOMString" (named) argument.
 *   - Setters must take that argument followed by a value argument.
 *   - There is only one variety of deleter - named property deleters -
 *     so a deleter must take a single "DOMString" argument.
 */
import { describe, expect, test } from "vitest";
import { isSpecialOperation, validateSpecialOperation } from "lib/webidl";

import {
  makeDOMStringType,
  makeLongType,
  makeUnsignedLongType,
} from "../../13-idl-types/utils";
import { makeOperation } from "../utils";

describe("isSpecialOperation", () => {
  test.each(["getter", "setter", "deleter"])(
    "returns true for an operation with the %s keyword",
    (keyword) => {
      const op = makeOperation({ keywords: [keyword] });

      expect(isSpecialOperation(op)).toBe(true);
    },
  );

  test("returns false for an operation without special keywords", () => {
    const op = makeOperation({ keywords: ["static"] });

    expect(isSpecialOperation(op)).toBe(false);
  });
});

describe("validateSpecialOperation - keywords", () => {
  test("throws TypeError for an operation without special keywords", () => {
    const op = makeOperation({ argumentTypes: [makeUnsignedLongType()] });

    expect(() => validateSpecialOperation(op)).toThrow(TypeError);
  });

  test("throws TypeError for combined getter and setter keywords", () => {
    const op = makeOperation({
      keywords: ["getter", "setter"],
      argumentTypes: [makeUnsignedLongType()],
    });

    expect(() => validateSpecialOperation(op)).toThrow(TypeError);
  });

  test("throws TypeError for a static special operation", () => {
    const op = makeOperation({
      keywords: ["static", "getter"],
      argumentTypes: [makeDOMStringType()],
    });

    expect(() => validateSpecialOperation(op)).toThrow(TypeError);
  });

  test("propagates operation validation - invalid identifier throws", () => {
    const op = makeOperation({
      identifier: "1foo",
      keywords: ["getter"],
      argumentTypes: [makeUnsignedLongType()],
    });

    expect(() => validateSpecialOperation(op)).toThrow(TypeError);
  });
});

describe("validateSpecialOperation - getter", () => {
  test('does not throw for an indexed getter ("unsigned long")', () => {
    const op = makeOperation({
      keywords: ["getter"],
      argumentTypes: [makeUnsignedLongType()],
    });

    expect(() => validateSpecialOperation(op)).not.toThrow();
  });

  test('does not throw for a named getter ("DOMString")', () => {
    const op = makeOperation({
      keywords: ["getter"],
      argumentTypes: [makeDOMStringType()],
    });

    expect(() => validateSpecialOperation(op)).not.toThrow();
  });

  test("does not throw for an unnamed getter", () => {
    const op = makeOperation({
      identifier: undefined,
      keywords: ["getter"],
      argumentTypes: [makeUnsignedLongType()],
    });

    expect(() => validateSpecialOperation(op)).not.toThrow();
  });

  test("throws TypeError for a getter without arguments", () => {
    const op = makeOperation({ keywords: ["getter"] });

    expect(() => validateSpecialOperation(op)).toThrow(TypeError);
  });

  test("throws TypeError for a getter with two arguments", () => {
    const op = makeOperation({
      keywords: ["getter"],
      argumentTypes: [makeUnsignedLongType(), makeDOMStringType()],
    });

    expect(() => validateSpecialOperation(op)).toThrow(TypeError);
  });

  test("throws TypeError for a getter with a non-index/name argument", () => {
    const op = makeOperation({
      keywords: ["getter"],
      argumentTypes: [makeLongType()],
    });

    expect(() => validateSpecialOperation(op)).toThrow(TypeError);
  });
});

describe("validateSpecialOperation - setter", () => {
  test("does not throw for an indexed setter with a value argument", () => {
    const op = makeOperation({
      keywords: ["setter"],
      argumentTypes: [makeUnsignedLongType(), makeDOMStringType()],
    });

    expect(() => validateSpecialOperation(op)).not.toThrow();
  });

  test("does not throw for a named setter with a value argument", () => {
    const op = makeOperation({
      keywords: ["setter"],
      argumentTypes: [makeDOMStringType(), makeLongType()],
    });

    expect(() => validateSpecialOperation(op)).not.toThrow();
  });

  test("throws TypeError for a setter with a single argument", () => {
    const op = makeOperation({
      keywords: ["setter"],
      argumentTypes: [makeUnsignedLongType()],
    });

    expect(() => validateSpecialOperation(op)).toThrow(TypeError);
  });

  test("throws TypeError for a setter with a non-index/name first argument", () => {
    const op = makeOperation({
      keywords: ["setter"],
      argumentTypes: [makeLongType(), makeDOMStringType()],
    });

    expect(() => validateSpecialOperation(op)).toThrow(TypeError);
  });
});

describe("validateSpecialOperation - deleter", () => {
  test('does not throw for a named deleter ("DOMString")', () => {
    const op = makeOperation({
      keywords: ["deleter"],
      argumentTypes: [makeDOMStringType()],
    });

    expect(() => validateSpecialOperation(op)).not.toThrow();
  });

  test('throws TypeError for a deleter with an "unsigned long" argument', () => {
    // There is no indexed deleter: named property deleters are the only
    // variety, so "unsigned long" must be rejected.
    const op = makeOperation({
      keywords: ["deleter"],
      argumentTypes: [makeUnsignedLongType()],
    });

    expect(() => validateSpecialOperation(op)).toThrow(TypeError);
  });

  test("throws TypeError for a deleter with two arguments", () => {
    const op = makeOperation({
      keywords: ["deleter"],
      argumentTypes: [makeDOMStringType(), makeDOMStringType()],
    });

    expect(() => validateSpecialOperation(op)).toThrow(TypeError);
  });
});
