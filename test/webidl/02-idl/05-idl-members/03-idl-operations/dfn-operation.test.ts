/**
 * @see https://webidl.spec.whatwg.org/#dfn-operation
 *
 * Spec rules exercised here:
 *   - The identifier of an operation, if present, must be a valid
 *     Web IDL identifier (special operations may be unnamed).
 *   - A static operation must not have the identifier "prototype".
 *   - The identifier of each argument must be a valid Web IDL identifier and
 *     must not repeat the identifier of another argument of the same operation.
 *   - Only an optional argument can be declared with a default value.
 */
import { describe, expect, test } from "vitest";
import { validateOperation } from "lib/webidl";

import { makeOperation } from "../utils";
import { makeDOMStringType, makeLongType } from "../../13-idl-types/utils";

describe("validateOperation - identifier", () => {
  test("does not throw for a valid identifier", () => {
    const op = makeOperation({ identifier: "item" });

    expect(() => validateOperation(op)).not.toThrow();
  });

  test("does not throw for an unnamed operation", () => {
    const op = makeOperation({ identifier: undefined });

    expect(() => validateOperation(op)).not.toThrow();
  });

  test("throws TypeError for an identifier with invalid characters", () => {
    const op = makeOperation({ identifier: "1foo" });

    expect(() => validateOperation(op)).toThrow(TypeError);
  });

  test("throws TypeError for an empty-string identifier", () => {
    const op = makeOperation({ identifier: "" });

    expect(() => validateOperation(op)).toThrow(TypeError);
  });
});

describe('validateOperation - static "prototype" rule', () => {
  test('throws TypeError for a static operation named "prototype"', () => {
    const op = makeOperation({
      identifier: "prototype",
      keywords: ["static"],
    });

    expect(() => validateOperation(op)).toThrow(TypeError);
  });

  test('does not throw for a regular operation named "prototype"', () => {
    const op = makeOperation({ identifier: "prototype" });

    expect(() => validateOperation(op)).not.toThrow();
  });

  test("does not throw for a static operation with another name", () => {
    const op = makeOperation({ identifier: "create", keywords: ["static"] });

    expect(() => validateOperation(op)).not.toThrow();
  });
});

describe("validateOperation - argument identifiers", () => {
  test("does not throw for distinct, valid argument identifiers", () => {
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        { type: makeLongType(), identifier: "x" },
        { type: makeLongType(), identifier: "y" },
      ],
    });

    expect(() => validateOperation(op)).not.toThrow();
  });

  test("throws TypeError for an argument identifier with invalid characters", () => {
    const op = makeOperation({
      identifier: "draw",
      arguments: [{ type: makeLongType(), identifier: "1x" }],
    });

    expect(() => validateOperation(op)).toThrow(TypeError);
  });

  test("throws TypeError when two arguments share an identifier", () => {
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        { type: makeLongType(), identifier: "x" },
        { type: makeDOMStringType(), identifier: "x" },
      ],
    });

    expect(() => validateOperation(op)).toThrow(/declared twice/i);
  });
});

describe("validateOperation - optional argument default values", () => {
  test("does not throw for a default value on an optional argument", () => {
    const op = makeOperation({
      identifier: "lookup",
      arguments: [
        {
          type: makeDOMStringType(),
          identifier: "mode",
          keywords: ["optional"],
          defaultValue: "auto",
        },
      ],
    });

    expect(() => validateOperation(op)).not.toThrow();
  });

  test("does not throw for an optional argument without a default value", () => {
    const op = makeOperation({
      identifier: "lookup",
      arguments: [
        {
          type: makeDOMStringType(),
          identifier: "mode",
          keywords: ["optional"],
        },
      ],
    });

    expect(() => validateOperation(op)).not.toThrow();
  });

  test("throws TypeError for a default value on a required argument", () => {
    const op = makeOperation({
      identifier: "lookup",
      arguments: [
        {
          type: makeDOMStringType(),
          identifier: "mode",
          defaultValue: "auto",
        },
      ],
    });

    expect(() => validateOperation(op)).toThrow(/optional/i);
  });

  test("treats an explicit undefined default value as a declared default", () => {
    // The `undefined` token is a valid default value, so what marks an argument
    // as declared with one is the presence of the key, not the value stored.
    const op = makeOperation({
      identifier: "lookup",
      arguments: [
        {
          type: makeDOMStringType(),
          identifier: "mode",
          defaultValue: undefined,
        },
      ],
    });

    expect(() => validateOperation(op)).toThrow(/optional/i);
  });
});
