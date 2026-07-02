/**
 * @see https://webidl.spec.whatwg.org/#dfn-nullable-type
 *
 * Spec rule: the inner type of a nullable type must not be:
 *   - any,
 *   - a promise type,
 *   - an observable array type,
 *   - another nullable type, or
 *   - a union type that itself includes a nullable type or has a
 *     dictionary type as one of its flattened member types.
 */
import { describe, expect, test } from "vitest";
import { validateNullableInnerType } from "lib/webidl";

import {
  makeAnnotatedType,
  makeAnyType,
  makeAsyncSequenceType,
  makeBigIntType,
  makeBooleanType,
  makeDictionaryType,
  makeDOMStringType,
  makeDoubleType,
  makeFrozenArrayType,
  makeInterfaceType,
  makeLongType,
  makeNullableType,
  makeObjectType,
  makeObservableArrayType,
  makePromiseType,
  makeRecordType,
  makeSequenceType,
  makeUndefinedType,
  makeUnionType,
  makeUnsignedLongType,
  makeUSVStringType,
} from "../utils";

describe("validateNullableInnerType - types disallowed by spec", () => {
  test("any throws TypeError", () => {
    expect(() => validateNullableInnerType(makeAnyType())).toThrow(TypeError);
  });

  test("promise type throws TypeError", () => {
    expect(() =>
      validateNullableInnerType(makePromiseType(makeBooleanType())),
    ).toThrow(TypeError);
  });

  test("observable array type throws TypeError", () => {
    expect(() =>
      validateNullableInnerType(makeObservableArrayType(makeLongType())),
    ).toThrow(TypeError);
  });

  test("nullable type throws TypeError", () => {
    expect(() =>
      validateNullableInnerType(makeNullableType(makeBooleanType())),
    ).toThrow(TypeError);
  });

  test("union including a nullable member throws TypeError", () => {
    const union = makeUnionType([
      makeNullableType(makeBooleanType()),
      makeDOMStringType(),
    ]);
    expect(() => validateNullableInnerType(union)).toThrow(TypeError);
  });

  test("union whose flattened member types include a dictionary throws TypeError", () => {
    const union = makeUnionType([makeDOMStringType(), makeDictionaryType()]);
    expect(() => validateNullableInnerType(union)).toThrow(TypeError);
  });
});

describe("validateNullableInnerType - types permitted by spec", () => {
  test("undefined is permitted", () => {
    expect(() => validateNullableInnerType(makeUndefinedType())).not.toThrow();
  });

  test("primitive numeric / boolean / bigint / string types are permitted", () => {
    expect(() => validateNullableInnerType(makeBooleanType())).not.toThrow();
    expect(() => validateNullableInnerType(makeLongType())).not.toThrow();
    expect(() =>
      validateNullableInnerType(makeUnsignedLongType()),
    ).not.toThrow();
    expect(() => validateNullableInnerType(makeDoubleType())).not.toThrow();
    expect(() => validateNullableInnerType(makeBigIntType())).not.toThrow();
    expect(() => validateNullableInnerType(makeDOMStringType())).not.toThrow();
    expect(() => validateNullableInnerType(makeUSVStringType())).not.toThrow();
  });

  test("object / interface types are permitted", () => {
    expect(() => validateNullableInnerType(makeObjectType())).not.toThrow();
    class Foo {}
    expect(() =>
      validateNullableInnerType(makeInterfaceType(Foo)),
    ).not.toThrow();
  });

  test("dictionary (as the direct inner type) is permitted by this predicate", () => {
    // Per spec, dictionaries may be nullable in general; the operation
    // argument / member restriction is enforced elsewhere.
    expect(() => validateNullableInnerType(makeDictionaryType())).not.toThrow();
  });

  test("sequence / async sequence / record / frozen array types are permitted", () => {
    expect(() =>
      validateNullableInnerType(makeSequenceType(makeLongType())),
    ).not.toThrow();
    expect(() =>
      validateNullableInnerType(makeAsyncSequenceType(makeDOMStringType())),
    ).not.toThrow();
    expect(() =>
      validateNullableInnerType(
        makeRecordType(makeDOMStringType(), makeDoubleType()),
      ),
    ).not.toThrow();
    expect(() =>
      validateNullableInnerType(makeFrozenArrayType(makeLongType())),
    ).not.toThrow();
  });

  test("annotated type wrapping a permitted inner type is permitted", () => {
    const annotated = makeAnnotatedType(makeDOMStringType(), {
      legacyNullToEmptyString: true,
    });
    expect(() => validateNullableInnerType(annotated)).not.toThrow();
  });

  test("union with no nullable members and no dictionary in flattened types is permitted", () => {
    const union = makeUnionType([makeDOMStringType(), makeLongType()]);
    expect(() => validateNullableInnerType(union)).not.toThrow();
  });
});
