/**
 * @see https://webidl.spec.whatwg.org/#idl-annotated-types
 *
 * Type-level extended attributes are encoded as own symbol-keyed
 * properties on a synthesized `Type` value. `isAnnotatedWithExtAttribute`
 * is the runtime test for "the type is associated with the given
 * extended attribute" - the spec's set-membership check.
 */
import { describe, expect, test } from "vitest";
import {
  AllowResizable,
  AllowShared,
  Clamp,
  EnforceRange,
  getExtAttributesAssociatedWith,
  isAnnotatedWithExtAttribute,
  LegacyNullToEmptyString,
} from "lib/webidl";

import {
  makeBooleanType,
  makeDOMStringType,
  makeLongType,
  makeUSVStringType,
} from "../utils";

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

  test("returns false for nullish or non-object inputs", () => {
    expect(
      isAnnotatedWithExtAttribute(undefined, LegacyNullToEmptyString),
    ).toBe(false);
    expect(
      isAnnotatedWithExtAttribute(null as never, LegacyNullToEmptyString),
    ).toBe(false);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#idl-type-extended-attribute-associated-with
 *
 * Returns the set of extended attributes applicable to types that the
 * given IDL type T is annotated with.
 */
describe("getExtAttributesAssociatedWith", () => {
  test("returns an empty object when the type is not annotated", () => {
    const T = makeBooleanType();
    expect(getExtAttributesAssociatedWith(T)).toEqual({});
  });

  test("returns the extendedAttributes object when one extended attribute is present", () => {
    const T = makeLongType({ clamp: true });
    expect(getExtAttributesAssociatedWith(T)).toEqual({ [Clamp]: null });
  });

  test("returns every extended attribute the type carries", () => {
    const T = makeLongType({
      enforceRange: true,
      allowShared: true,
      allowResizable: true,
    });
    expect(getExtAttributesAssociatedWith(T)).toEqual({
      [EnforceRange]: null,
      [AllowShared]: null,
      [AllowResizable]: null,
    });
  });

  test("works across multiple distinct string types carrying the same attribute", () => {
    const dom = makeDOMStringType({ legacyNullToEmptyString: true });
    const usv = makeUSVStringType({ legacyNullToEmptyString: true });
    expect(getExtAttributesAssociatedWith(dom)).toEqual({
      [LegacyNullToEmptyString]: null,
    });
    expect(getExtAttributesAssociatedWith(usv)).toEqual({
      [LegacyNullToEmptyString]: null,
    });
  });
});
