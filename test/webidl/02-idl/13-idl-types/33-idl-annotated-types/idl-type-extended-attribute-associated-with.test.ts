/**
 * @see https://webidl.spec.whatwg.org/#idl-type-extended-attribute-associated-with
 *
 * Returns the set of extended attributes applicable to types that the
 * given IDL type T is annotated with.
 */
import { describe, expect, test } from "vitest";
import {
  AllowResizable,
  AllowShared,
  Clamp,
  EnforceRange,
  getExtAttributesAssociatedWith,
  LegacyNullToEmptyString,
} from "lib/webidl";

import {
  makeBooleanType,
  makeDOMStringType,
  makeLongType,
  makeUSVStringType,
} from "../utils";

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
