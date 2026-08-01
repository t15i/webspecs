/**
 * @see https://webidl.spec.whatwg.org/#dfn-named-property-getter
 *
 * `validateNamedPropertyGetter` performs the argument-shape check for the
 * named-getter variety: exactly one argument, typed "DOMString".
 */
import { describe, expect, test } from "vitest";
import { validateNamedPropertyGetter } from "lib/webidl";

import {
  makeDOMStringType,
  makeUnsignedLongType,
} from "../../13-idl-types/utils";
import { makeOperation } from "../utils";

describe("validateNamedPropertyGetter", () => {
  test('does not throw for a single "DOMString" argument', () => {
    const op = makeOperation({
      keywords: ["getter"],
      argumentTypes: [makeDOMStringType()],
    });

    expect(() => validateNamedPropertyGetter(op)).not.toThrow();
  });

  test("throws TypeError without arguments", () => {
    const op = makeOperation({ keywords: ["getter"] });

    expect(() => validateNamedPropertyGetter(op)).toThrow(TypeError);
  });

  test("throws TypeError with two arguments", () => {
    const op = makeOperation({
      keywords: ["getter"],
      argumentTypes: [makeDOMStringType(), makeDOMStringType()],
    });

    expect(() => validateNamedPropertyGetter(op)).toThrow(TypeError);
  });

  test('throws TypeError for an "unsigned long" argument (that is an indexed getter)', () => {
    const op = makeOperation({
      keywords: ["getter"],
      argumentTypes: [makeUnsignedLongType()],
    });

    expect(() => validateNamedPropertyGetter(op)).toThrow(TypeError);
  });
});
