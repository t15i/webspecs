/**
 * @see https://webidl.spec.whatwg.org/#idl-extended-attributes
 *
 * Extended attributes are encoded as own symbol-keyed properties of the
 * `extendedAttributes` object carried by interfaces, members, and
 * annotated types. `isAnnotatedWithExtAttribute` is the runtime test for
 * "the value is associated with the given extended attribute" - the
 * spec's set-membership check.
 */
import { describe, expect, test } from "vitest";
import {
  Clamp,
  EnforceRange,
  isAnnotatedWithExtAttribute,
  LegacyNullToEmptyString,
} from "lib/webidl";

import {
  makeDOMStringType,
  makeLongType,
  makeUSVStringType,
} from "../13-idl-types/utils";

describe("isAnnotatedWithExtAttribute", () => {
  test("returns true when the type carries the queried extended attribute", () => {
    const T = makeDOMStringType({ legacyNullToEmptyString: true });
    expect(isAnnotatedWithExtAttribute(T, LegacyNullToEmptyString)).toBe(true);
  });

  test("returns false when the type does not carry the extended attribute", () => {
    const T = makeDOMStringType();
    expect(isAnnotatedWithExtAttribute(T, LegacyNullToEmptyString)).toBe(false);
  });

  test("distinguishes different extended attributes on the same type", () => {
    const T = makeLongType({ clamp: true });
    expect(isAnnotatedWithExtAttribute(T, Clamp)).toBe(true);
    expect(isAnnotatedWithExtAttribute(T, EnforceRange)).toBe(false);
  });

  test("works across multiple distinct string types", () => {
    const dom = makeDOMStringType({ legacyNullToEmptyString: true });
    const usv = makeUSVStringType({ legacyNullToEmptyString: true });
    expect(isAnnotatedWithExtAttribute(dom, LegacyNullToEmptyString)).toBe(
      true,
    );
    expect(isAnnotatedWithExtAttribute(usv, LegacyNullToEmptyString)).toBe(
      true,
    );
  });
});
