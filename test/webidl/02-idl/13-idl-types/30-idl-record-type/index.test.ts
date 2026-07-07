/**
 * @see https://webidl.spec.whatwg.org/#idl-record
 *
 * Spec rule: the key type K of a record\<K, V\> must be one of
 * DOMString, USVString, or ByteString.
 */
import { describe, expect, test } from "vitest";
import { validateRecordKeyType } from "lib/webidl";

import {
  makeBigIntType,
  makeBooleanType,
  makeByteStringType,
  makeDOMStringType,
  makeDoubleType,
  makeInterfaceType,
  makeLongType,
  makeObjectType,
  makeUnsignedLongType,
  makeUSVStringType,
} from "../utils";

describe("validateRecordKeyType - permitted key types", () => {
  test("DOMString is permitted", () => {
    const T = makeDOMStringType();
    expect(validateRecordKeyType(T)).toBe(true);
  });

  test("USVString is permitted", () => {
    const T = makeUSVStringType();
    expect(validateRecordKeyType(T)).toBe(true);
  });

  test("ByteString is permitted", () => {
    const T = makeByteStringType();
    expect(validateRecordKeyType(T)).toBe(true);
  });
});

describe("validateRecordKeyType - disallowed key types", () => {
  test("boolean throws TypeError", () => {
    expect(() => validateRecordKeyType(makeBooleanType())).toThrow(TypeError);
  });

  test("long throws TypeError", () => {
    expect(() => validateRecordKeyType(makeLongType())).toThrow(TypeError);
  });

  test("unsigned long throws TypeError", () => {
    expect(() => validateRecordKeyType(makeUnsignedLongType())).toThrow(
      TypeError,
    );
  });

  test("double throws TypeError", () => {
    expect(() => validateRecordKeyType(makeDoubleType())).toThrow(TypeError);
  });

  test("bigint throws TypeError", () => {
    expect(() => validateRecordKeyType(makeBigIntType())).toThrow(TypeError);
  });

  test("object throws TypeError", () => {
    expect(() => validateRecordKeyType(makeObjectType())).toThrow(TypeError);
  });

  test("interface type throws TypeError", () => {
    class Foo {}
    expect(() => validateRecordKeyType(makeInterfaceType(Foo))).toThrow(
      TypeError,
    );
  });
});
