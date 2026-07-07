/**
 * @see https://webidl.spec.whatwg.org/#dfn-flattened-union-member-types
 *
 * Spec algorithm:
 *   1. Let T be the union type.
 *   2. Initialize S to \{\}.
 *   3. For each member type U of T:
 *      1. If U is an annotated type, then set U to be the inner type of U.
 *      2. If U is a nullable type, then set U to be the inner type of U.
 *      3. If U is a union type, then add to S the flattened member types
 *         of U.
 *      4. Otherwise, U is not a union type. Add U to S.
 *   4. Return S.
 */
import { describe, expect, test } from "vitest";
import {
  DICTIONARY_TYPE_NAME,
  DOM_STRING_TYPE_NAME,
  getFlattenedMemberTypes,
  INTERFACE_TYPE_NAME,
  LONG_TYPE_NAME,
  SEQUENCE_TYPE_NAME,
  validateFlattenedMemberTypes,
} from "lib/webidl";

import {
  makeAnnotatedType,
  makeBooleanType,
  makeDictionaryType,
  makeDOMStringType,
  makeDoubleType,
  makeInterfaceType,
  makeLongType,
  makeNullableType,
  makeSequenceType,
  makeUnionType,
  makeUnsignedLongType,
  makeUSVStringType,
} from "../utils";

describe("getFlattenedMemberTypes", () => {
  test("flattens a simple union into its members in order", () => {
    const long = makeLongType();
    const str = makeDOMStringType();
    const union = makeUnionType([long, str]);

    const flat = getFlattenedMemberTypes(union);

    expect(flat).toEqual([long, str]);
  });

  test("strips an annotated wrapper to expose the inner type", () => {
    const long = makeLongType();
    const annotatedLong = makeAnnotatedType(long, { clamp: true });
    const union = makeUnionType([annotatedLong, makeDOMStringType()]);

    const flat = getFlattenedMemberTypes(union);

    expect(flat[0]).toBe(long);
    expect(flat[0]?.name).toBe(LONG_TYPE_NAME);
  });

  test("strips a nullable wrapper to expose the inner type", () => {
    const long = makeLongType();
    const union = makeUnionType([makeNullableType(long), makeDOMStringType()]);

    const flat = getFlattenedMemberTypes(union);

    expect(flat[0]).toBe(long);
    expect(flat[0]?.name).toBe(LONG_TYPE_NAME);
  });

  test("strips an annotated-then-nullable wrapper to expose the inner type", () => {
    const long = makeLongType();
    const annotated = makeAnnotatedType(makeNullableType(long), {
      clamp: true,
    });
    const union = makeUnionType([annotated, makeDOMStringType()]);

    const flat = getFlattenedMemberTypes(union);

    expect(flat[0]).toBe(long);
    expect(flat[0]?.name).toBe(LONG_TYPE_NAME);
  });

  test("flattens nested unions into the outer union's set", () => {
    const long = makeLongType();
    const dbl = makeDoubleType();
    const str = makeDOMStringType();
    const inner = makeUnionType([dbl, str]);
    const outer = makeUnionType([long, inner]);

    const flat = getFlattenedMemberTypes(outer);

    expect(flat).toEqual([long, dbl, str]);
  });

  test("matches the spec example", () => {
    // (Node or (sequence<long> or Event) or (XMLHttpRequest or DOMString)?
    //   or sequence<(sequence<double> or NodeList)>)
    // -> [Node, sequence<long>, Event, XMLHttpRequest, DOMString,
    //     sequence<(sequence<double> or NodeList)>]
    class Node {}
    class Event {}
    class XMLHttpRequest {}
    class NodeList {}

    const nodeT = makeInterfaceType(Node);
    const eventT = makeInterfaceType(Event);
    const xhrT = makeInterfaceType(XMLHttpRequest);
    const nodeListT = makeInterfaceType(NodeList);

    const sequenceLong = makeSequenceType(makeLongType());
    const innerUnion1 = makeUnionType([sequenceLong, eventT]);

    const innerUnion2 = makeUnionType([xhrT, makeDOMStringType()]);
    const nullableInnerUnion2 = makeNullableType(innerUnion2);

    const sequenceDoubleOrNodeList = makeSequenceType(
      makeUnionType([makeSequenceType(makeDoubleType()), nodeListT]),
    );

    const outer = makeUnionType([
      nodeT,
      innerUnion1,
      nullableInnerUnion2,
      sequenceDoubleOrNodeList,
    ]);

    const flat = getFlattenedMemberTypes(outer);
    const names = flat.map((U) => U.name);

    expect(names).toEqual([
      INTERFACE_TYPE_NAME, // Node
      SEQUENCE_TYPE_NAME, // sequence<long>
      INTERFACE_TYPE_NAME, // Event
      INTERFACE_TYPE_NAME, // XMLHttpRequest
      DOM_STRING_TYPE_NAME, // DOMString
      SEQUENCE_TYPE_NAME, // sequence<(sequence<double> or NodeList)>
    ]);

    expect(flat).toHaveLength(6);
    expect(flat[0]).toBe(nodeT);
    expect(flat[1]).toBe(sequenceLong);
    expect(flat[2]).toBe(eventT);
    expect(flat[3]).toBe(xhrT);
    expect(flat[5]).toBe(sequenceDoubleOrNodeList);
  });

  test("dictionary types survive flattening when not wrapped", () => {
    const dict = makeDictionaryType();
    const union = makeUnionType([makeDOMStringType(), dict]);

    const flat = getFlattenedMemberTypes(union);

    expect(flat.map((U) => U.name)).toContain(DICTIONARY_TYPE_NAME);
    expect(flat[1]).toBe(dict);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#dfn-flattened-union-member-types
 *
 * Spec rule: each pair of flattened member types in a union type, T and U,
 * must be distinguishable.
 */
describe("validateFlattenedMemberTypes", () => {
  test("does not throw when all flattened member pairs are distinguishable", () => {
    const union = makeUnionType([makeLongType(), makeDOMStringType()]);

    expect(() => validateFlattenedMemberTypes(union)).not.toThrow();
  });

  test("does not throw for a single-member union (no pairs to compare)", () => {
    const union = makeUnionType([makeBooleanType()]);

    expect(() => validateFlattenedMemberTypes(union)).not.toThrow();
  });

  test("throws TypeError for two members in the same numeric category", () => {
    const union = makeUnionType([makeLongType(), makeUnsignedLongType()]);

    expect(() => validateFlattenedMemberTypes(union)).toThrow(TypeError);
  });

  test("throws TypeError for two members in the same string category", () => {
    const union = makeUnionType([makeDOMStringType(), makeUSVStringType()]);

    expect(() => validateFlattenedMemberTypes(union)).toThrow(TypeError);
  });

  test("throws TypeError for identical boolean members", () => {
    const union = makeUnionType([makeBooleanType(), makeBooleanType()]);

    expect(() => validateFlattenedMemberTypes(union)).toThrow(TypeError);
  });

  test("validates flattened (not raw) members - detects duplicate across nested union", () => {
    // (long or (DOMString or long)) is invalid: flattened = [long, DOMString, long]
    // and the long/long pair is not distinguishable, even though the raw
    // memberTypes are [long, union] which look distinct.
    const inner = makeUnionType([makeDOMStringType(), makeLongType()]);
    const outer = makeUnionType([makeLongType(), inner]);

    expect(() => validateFlattenedMemberTypes(outer)).toThrow(TypeError);
  });

  test("strips nullable/annotated wrappers before comparing", () => {
    // (long or long?) flattens to [long, long] - same numeric category.
    const annotatedLong = makeAnnotatedType(makeLongType(), { clamp: true });
    const nullableLong = makeNullableType(makeLongType());
    const union = makeUnionType([annotatedLong, nullableLong]);

    expect(() => validateFlattenedMemberTypes(union)).toThrow(TypeError);
  });
});
