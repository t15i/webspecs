/**
 * @see https://webidl.spec.whatwg.org/#dfn-named-property-setter
 *
 * `validateNamedPropertySetter` performs the argument-shape check for the
 * named-setter variety: a "DOMString" argument followed by a value argument.
 */
import { describe, expect, test } from "vitest";
import { validateNamedPropertySetter } from "lib/webidl";

import {
  makeDOMStringType,
  makeLongType,
  makeUnsignedLongType,
} from "../../13-idl-types/utils";
import { makeOperation } from "../utils";

describe("validateNamedPropertySetter", () => {
  test('does not throw for a "DOMString" argument and a value argument', () => {
    const op = makeOperation({
      keywords: ["setter"],
      argumentTypes: [makeDOMStringType(), makeLongType()],
    });

    expect(() => validateNamedPropertySetter(op)).not.toThrow();
  });

  test("throws TypeError with a single argument", () => {
    const op = makeOperation({
      keywords: ["setter"],
      argumentTypes: [makeDOMStringType()],
    });

    expect(() => validateNamedPropertySetter(op)).toThrow(TypeError);
  });

  test('throws TypeError when the first argument is an "unsigned long" (that is an indexed setter)', () => {
    const op = makeOperation({
      keywords: ["setter"],
      argumentTypes: [makeUnsignedLongType(), makeLongType()],
    });

    expect(() => validateNamedPropertySetter(op)).toThrow(TypeError);
  });
});
