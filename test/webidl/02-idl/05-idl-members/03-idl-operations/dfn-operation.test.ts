/**
 * @see https://webidl.spec.whatwg.org/#dfn-operation
 *
 * Spec rules exercised here:
 *   - The identifier of an operation, if present, must be a valid
 *     Web IDL identifier (special operations may be unnamed).
 *   - A static operation must not have the identifier "prototype".
 */
import { describe, expect, test } from "vitest";
import { validateOperation } from "lib/webidl";

import { makeOperation } from "../utils";

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
