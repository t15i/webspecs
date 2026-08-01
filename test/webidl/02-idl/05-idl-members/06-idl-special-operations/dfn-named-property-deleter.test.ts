/**
 * @see https://webidl.spec.whatwg.org/#dfn-named-property-deleter
 *
 * `validateNamedPropertyDeleter` performs the argument-shape check for the
 * (only) deleter variety: exactly one argument, typed "DOMString".
 */
import { describe, expect, test } from "vitest";
import { validateNamedPropertyDeleter } from "lib/webidl";

import {
  makeDOMStringType,
  makeUnsignedLongType,
} from "../../13-idl-types/utils";
import { makeOperation } from "../utils";

describe("validateNamedPropertyDeleter", () => {
  test('does not throw for a single "DOMString" argument', () => {
    const op = makeOperation({
      keywords: ["deleter"],
      argumentTypes: [makeDOMStringType()],
    });

    expect(() => validateNamedPropertyDeleter(op)).not.toThrow();
  });

  test("throws TypeError without arguments", () => {
    const op = makeOperation({ keywords: ["deleter"] });

    expect(() => validateNamedPropertyDeleter(op)).toThrow(TypeError);
  });

  test("throws TypeError with two arguments", () => {
    const op = makeOperation({
      keywords: ["deleter"],
      argumentTypes: [makeDOMStringType(), makeDOMStringType()],
    });

    expect(() => validateNamedPropertyDeleter(op)).toThrow(TypeError);
  });

  test('throws TypeError for an "unsigned long" argument (there is no indexed deleter)', () => {
    const op = makeOperation({
      keywords: ["deleter"],
      argumentTypes: [makeUnsignedLongType()],
    });

    expect(() => validateNamedPropertyDeleter(op)).toThrow(TypeError);
  });
});
