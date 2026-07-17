/**
 * @see https://webidl.spec.whatwg.org/#dfn-attribute
 *
 * Spec rules exercised here:
 *   - The identifier of an attribute must be a valid Web IDL identifier.
 *   - A static attribute must not have the identifier "prototype".
 *   - The type of an attribute, after resolving typedefs and stripping
 *     annotated/nullable wrappers, must not be a sequence, dictionary,
 *     or record type, nor a union type with any of those as a flattened
 *     member type.
 *   - An attribute declared with `inherit` must be a read-only regular
 *     attribute.
 */
import { describe, expect, test } from "vitest";
import { validateAttribute } from "lib/webidl";

import {
  makeAnnotatedType,
  makeDictionaryType,
  makeDOMStringType,
  makeFrozenArrayType,
  makeLongType,
  makeNullableType,
  makeRecordType,
  makeSequenceType,
  makeUnionType,
} from "../../13-idl-types/utils";
import { makeAttribute } from "../utils";

describe("validateAttribute - identifier", () => {
  test("does not throw for a valid identifier", () => {
    const attr = makeAttribute({ type: makeLongType(), identifier: "length" });

    expect(() => validateAttribute(attr)).not.toThrow();
  });

  test("throws TypeError for an identifier with invalid characters", () => {
    const attr = makeAttribute({ type: makeLongType(), identifier: "1foo" });

    expect(() => validateAttribute(attr)).toThrow(TypeError);
  });

  test("throws TypeError for an empty-string identifier", () => {
    const attr = makeAttribute({ type: makeLongType(), identifier: "" });

    expect(() => validateAttribute(attr)).toThrow(TypeError);
  });
});

describe('validateAttribute - static "prototype" rule', () => {
  test('throws TypeError for a static attribute named "prototype"', () => {
    const attr = makeAttribute({
      type: makeLongType(),
      identifier: "prototype",
      keywords: ["static"],
    });

    expect(() => validateAttribute(attr)).toThrow(TypeError);
  });

  test('does not throw for a regular attribute named "prototype"', () => {
    const attr = makeAttribute({
      type: makeLongType(),
      identifier: "prototype",
    });

    expect(() => validateAttribute(attr)).not.toThrow();
  });

  test("does not throw for a static attribute with another name", () => {
    const attr = makeAttribute({
      type: makeLongType(),
      identifier: "instance",
      keywords: ["static"],
    });

    expect(() => validateAttribute(attr)).not.toThrow();
  });
});

describe("validateAttribute - type restrictions", () => {
  test("throws TypeError for a sequence type", () => {
    const attr = makeAttribute({ type: makeSequenceType(makeLongType()) });

    expect(() => validateAttribute(attr)).toThrow(TypeError);
  });

  test("throws TypeError for a dictionary type", () => {
    const attr = makeAttribute({ type: makeDictionaryType() });

    expect(() => validateAttribute(attr)).toThrow(TypeError);
  });

  test("throws TypeError for a record type", () => {
    const attr = makeAttribute({
      type: makeRecordType(makeDOMStringType(), makeLongType()),
    });

    expect(() => validateAttribute(attr)).toThrow(TypeError);
  });

  test("strips a nullable wrapper before checking - sequence? throws", () => {
    const attr = makeAttribute({
      type: makeNullableType(makeSequenceType(makeLongType())),
    });

    expect(() => validateAttribute(attr)).toThrow(TypeError);
  });

  test("strips an annotated-then-nullable wrapper - sequence throws", () => {
    const attr = makeAttribute({
      type: makeAnnotatedType(
        makeNullableType(makeSequenceType(makeLongType())),
        { clamp: true },
      ),
    });

    expect(() => validateAttribute(attr)).toThrow(TypeError);
  });

  test("throws TypeError for a union with a sequence member", () => {
    const attr = makeAttribute({
      type: makeUnionType([
        makeSequenceType(makeLongType()),
        makeDOMStringType(),
      ]),
    });

    expect(() => validateAttribute(attr)).toThrow(TypeError);
  });

  test("throws TypeError for a union with a dictionary member", () => {
    const attr = makeAttribute({
      type: makeUnionType([makeDictionaryType(), makeDOMStringType()]),
    });

    expect(() => validateAttribute(attr)).toThrow(TypeError);
  });

  test("throws TypeError for a union with a record member", () => {
    const attr = makeAttribute({
      type: makeUnionType([
        makeRecordType(makeDOMStringType(), makeLongType()),
        makeLongType(),
      ]),
    });

    expect(() => validateAttribute(attr)).toThrow(TypeError);
  });

  test("does not throw for a union of allowed member types", () => {
    const attr = makeAttribute({
      type: makeUnionType([makeLongType(), makeDOMStringType()]),
    });

    expect(() => validateAttribute(attr)).not.toThrow();
  });

  test("does not throw for a FrozenArray type", () => {
    const attr = makeAttribute({ type: makeFrozenArrayType(makeLongType()) });

    expect(() => validateAttribute(attr)).not.toThrow();
  });
});

describe('validateAttribute - "inherit" rule', () => {
  test("does not throw for an inherit read-only regular attribute", () => {
    const attr = makeAttribute({
      type: makeLongType(),
      keywords: ["inherit", "readonly"],
    });

    expect(() => validateAttribute(attr)).not.toThrow();
  });

  test("throws TypeError for an inherit attribute that is not read-only", () => {
    const attr = makeAttribute({
      type: makeLongType(),
      keywords: ["inherit"],
    });

    expect(() => validateAttribute(attr)).toThrow(TypeError);
  });

  test("throws TypeError for an inherit read-only static attribute", () => {
    const attr = makeAttribute({
      type: makeLongType(),
      keywords: ["inherit", "readonly", "static"],
    });

    expect(() => validateAttribute(attr)).toThrow(TypeError);
  });
});

describe("validateAttribute - read-only / setter steps", () => {
  test("does not throw for a read-only attribute without setter steps", () => {
    const attr = makeAttribute({
      type: makeLongType(),
      keywords: ["readonly"],
    });

    expect(() => validateAttribute(attr)).not.toThrow();
  });

  test("does not throw for a read-write attribute with setter steps", () => {
    const attr = makeAttribute({ type: makeLongType() });

    expect(() => validateAttribute(attr)).not.toThrow();
  });

  test("throws TypeError for a read-only attribute that defines setter steps", () => {
    const attr = makeAttribute({
      type: makeLongType(),
      keywords: ["readonly"],
      setterSteps: () => undefined,
    });

    expect(() => validateAttribute(attr)).toThrow(TypeError);
  });

  test("throws TypeError for a read-write attribute without setter steps", () => {
    const attr = makeAttribute({
      type: makeLongType(),
      setterSteps: undefined,
    });

    expect(() => validateAttribute(attr)).toThrow(TypeError);
  });
});
