/**
 * @see https://webidl.spec.whatwg.org/#dfn-distinguishable
 *
 * The first step of the algorithm: if one type includes a nullable type, it is
 * distinguishable from the other only when that other neither includes a
 * nullable type nor carries a dictionary type. The remaining cases fall to the
 * distinguishability table, where a numeric type and a string type are told
 * apart but two numeric types are not.
 */
import { describe, expect, test } from "vitest";
import { isDistinguishable } from "lib/webidl";
import type { Type } from "lib/webidl";

import {
  makeAnnotatedType,
  makeAnyType,
  makeAsyncSequenceType,
  makeBigIntType,
  makeBooleanType,
  makeByteStringType,
  makeCallbackFunctionType,
  makeCallbackInterfaceType,
  makeDOMStringType,
  makeDictionaryType,
  makeDoubleType,
  makeFrozenArrayType,
  makeInterfaceType,
  makeLongType,
  makeNullableType,
  makeObjectType,
  makePromiseType,
  makeUndefinedType,
  makeRecordType,
  makeSequenceType,
  makeUSVStringType,
  makeUnionType,
} from "../../13-idl-types/utils";

class Interface1 {}
class Interface2 {}

describe("isDistinguishable - types that include a nullable type", () => {
  test("a nullable numeric type is not distinguishable from a dictionary type", () => {
    expect(
      isDistinguishable(
        makeNullableType(makeDoubleType()),
        makeDictionaryType(),
      ),
    ).toBe(false);
  });

  test("two nullable union types are not distinguishable", () => {
    const one = makeNullableType(
      makeUnionType([makeInterfaceType(Interface1), makeLongType()]),
    );
    const other = makeNullableType(
      makeUnionType([makeInterfaceType(Interface2), makeDOMStringType()]),
    );

    expect(isDistinguishable(one, other)).toBe(false);
  });

  test("a union carrying a dictionary is not distinguishable from a nullable union", () => {
    const one = makeUnionType([makeDictionaryType(), makeLongType()]);
    const other = makeNullableType(
      makeUnionType([makeInterfaceType(Interface2), makeDOMStringType()]),
    );

    expect(isDistinguishable(one, other)).toBe(false);
  });

  test("a nullable string type is distinguishable from a plain numeric type", () => {
    // The other type neither includes a nullable type nor is dictionary-like,
    // so the pair is decided by the table, where string and numeric differ.
    expect(
      isDistinguishable(makeNullableType(makeDOMStringType()), makeLongType()),
    ).toBe(true);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#dfn-distinguishable
 *
 * The fourth step of the algorithm, decided by the table under § 2.5.8:
 * "If these two innermost types appear or are in categories appearing in the
 * following table and there is a '●' mark in the corresponding entry or there
 * is a letter in the corresponding entry and the designated additional
 * requirement below the table is satisfied, then return true. Otherwise return
 * false."
 *
 * Transcribed below is the table itself: each row lists the entries the table
 * marks in it, from the diagonal rightwards, exactly as it draws them. The
 * table states each pair once, in one order, but distinguishability is a
 * property of the pair, so every cell is asserted both ways round.
 *
 * The letters are the cells carrying an additional requirement. (b) and (d)
 * only qualify what a marked cell means elsewhere, so they read as marked here;
 * (a) and (c) are conditions on the pair, and the representatives below are
 * chosen to satisfy them — what happens when they do not has its own tests.
 */
type Category =
  | "undefined"
  | "boolean"
  | "numeric types"
  | "bigint"
  | "string types"
  | "object"
  | "symbol"
  | "interface-like"
  | "callback function"
  | "dictionary-like"
  | "async sequence"
  | "sequence-like";

const CATEGORIES: readonly Category[] = [
  "undefined",
  "boolean",
  "numeric types",
  "bigint",
  "string types",
  "object",
  "symbol",
  "interface-like",
  "callback function",
  "dictionary-like",
  "async sequence",
  "sequence-like",
];

const MARKED: Record<Category, readonly Category[]> = {
  undefined: [
    "boolean",
    "numeric types",
    "bigint",
    "string types",
    "object",
    "symbol",
    "interface-like",
    "callback function",
    // dictionary-like is blank: undefined converts to a dictionary whose
    // members all take their default values.
    "async sequence",
    "sequence-like",
  ],
  boolean: [
    "numeric types",
    "bigint",
    "string types",
    "object",
    "symbol",
    "interface-like",
    "callback function",
    "dictionary-like",
    "async sequence",
    "sequence-like",
  ],
  "numeric types": [
    "bigint", // (b)
    "string types",
    "object",
    "symbol",
    "interface-like",
    "callback function",
    "dictionary-like",
    "async sequence",
    "sequence-like",
  ],
  bigint: [
    "string types",
    "object",
    "symbol",
    "interface-like",
    "callback function",
    "dictionary-like",
    "async sequence",
    "sequence-like",
  ],
  "string types": [
    "object",
    "symbol",
    "interface-like",
    "callback function",
    "dictionary-like",
    "async sequence", // (d)
    "sequence-like",
  ],
  object: ["symbol"],
  symbol: [
    "interface-like",
    "callback function",
    "dictionary-like",
    "async sequence",
    "sequence-like",
  ],
  "interface-like": [
    "interface-like", // (a)
    "callback function",
    "dictionary-like",
    "async sequence",
    "sequence-like",
  ],
  "callback function": [
    "dictionary-like", // (c)
    "async sequence",
    "sequence-like",
  ],
  "dictionary-like": ["async sequence", "sequence-like"],
  "async sequence": [],
  "sequence-like": [],
};

/**
 * Two types per category, so that a cell on the diagonal compares two members
 * of one category rather than a type with itself. Where the category holds
 * several types, the two are different ones, which is what makes the diagonal
 * say something: `long` and `double` are told apart by neither.
 *
 * `symbol` has no entry — the symbol type is not modelled yet — so the cells
 * naming it are left out of this walk.
 */
const REPRESENTATIVES: Partial<Record<Category, [() => Type, () => Type]>> = {
  undefined: [makeUndefinedType, makeUndefinedType],
  boolean: [makeBooleanType, makeBooleanType],
  "numeric types": [makeLongType, makeDoubleType],
  bigint: [makeBigIntType, makeBigIntType],
  "string types": [makeDOMStringType, makeUSVStringType],
  object: [makeObjectType, makeObjectType],
  "interface-like": [
    () => makeInterfaceType(Interface1),
    () => makeInterfaceType(Interface2),
  ],
  "callback function": [makeCallbackFunctionType, makeCallbackFunctionType],
  "dictionary-like": [
    makeDictionaryType,
    () => makeRecordType(makeDOMStringType(), makeLongType()),
  ],
  "async sequence": [
    () => makeAsyncSequenceType(makeLongType()),
    () => makeAsyncSequenceType(makeLongType()),
  ],
  "sequence-like": [
    () => makeSequenceType(makeLongType()),
    () => makeFrozenArrayType(makeLongType()),
  ],
};

describe("isDistinguishable - every cell of the table", () => {
  for (const [i, row] of CATEGORIES.entries()) {
    for (const column of CATEGORIES.slice(i)) {
      const one = REPRESENTATIVES[row];
      const other = REPRESENTATIVES[column];

      if (one === undefined || other === undefined) {
        continue;
      }

      const marked = MARKED[row].includes(column);

      test(`${row} and ${column} are ${marked ? "" : "not "}distinguishable`, () => {
        expect(isDistinguishable(one[0](), other[1]())).toBe(marked);
        expect(isDistinguishable(other[1](), one[0]())).toBe(marked);
      });
    }
  }
});

/**
 * @see https://webidl.spec.whatwg.org/#dfn-distinguishable
 *
 * Requirement (a) below the table: two interface-like types are distinguishable
 * only when "the two identified interface-like types are not the same, and no
 * single platform object implements both". The two halves do separate work.
 *
 * Sameness is sameness of the interface, not of the object standing for its
 * type: nothing interns those, so one interface can be named by two of them.
 * The second half is inheritance in either direction, which is what lets one
 * platform object implement both — and it cannot stand in for the first, since
 * an interface does not inherit from itself.
 *
 * The types compared are the innermost ones the fourth step identifies, which
 * is why a nullable wrapper does not make a type differ from itself.
 */
describe("isDistinguishable - interface-like types", () => {
  const Interface1Type = makeInterfaceType(Interface1);
  const Interface2Type = makeInterfaceType(Interface2);

  test("an interface type is not distinguishable from itself", () => {
    expect(isDistinguishable(Interface1Type, Interface1Type)).toBe(false);
  });

  test("an interface named by two type objects is not distinguishable from itself", () => {
    // Every platform object implementing it implements both, so they are the
    // same interface however many objects stand for its type.
    expect(
      isDistinguishable(
        makeInterfaceType(Interface1),
        makeInterfaceType(Interface1),
      ),
    ).toBe(false);
  });

  test("an interface type is not distinguishable from one it inherits from", () => {
    class Derived extends Interface1 {}

    expect(isDistinguishable(makeInterfaceType(Derived), Interface1Type)).toBe(
      false,
    );
  });

  test("is decided the same way round either way", () => {
    class Derived extends Interface1 {}

    expect(isDistinguishable(Interface1Type, makeInterfaceType(Derived))).toBe(
      false,
    );
  });

  test("an interface type is not distinguishable from one further up its chain", () => {
    class Middle extends Interface1 {}
    class Leaf extends Middle {}

    expect(isDistinguishable(makeInterfaceType(Leaf), Interface1Type)).toBe(
      false,
    );
  });

  test("two interface types with a common ancestor are distinguishable", () => {
    // Neither inherits the other, so no one platform object implements both.
    class One extends Interface1 {}
    class Other extends Interface1 {}

    expect(
      isDistinguishable(makeInterfaceType(One), makeInterfaceType(Other)),
    ).toBe(true);
  });

  test("a nullable interface type is not distinguishable from the same interface type", () => {
    expect(
      isDistinguishable(makeNullableType(Interface1Type), Interface1Type),
    ).toBe(false);
  });

  test("a nullable interface type is distinguishable from an unrelated interface type", () => {
    expect(
      isDistinguishable(makeNullableType(Interface1Type), Interface2Type),
    ).toBe(true);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#dfn-distinguishable
 *
 * The table is stated over categories, not over individual types: every string
 * type stands in for "string types", and a record or a callback interface is
 * dictionary-like just as a dictionary is.
 */
describe("isDistinguishable - the categories of the table", () => {
  test("a ByteString is a string type", () => {
    expect(isDistinguishable(makeByteStringType(), makeLongType())).toBe(true);
    expect(isDistinguishable(makeByteStringType(), makeDOMStringType())).toBe(
      false,
    );
  });

  test("a record type is dictionary-like", () => {
    const record = makeRecordType(makeDOMStringType(), makeLongType());

    expect(isDistinguishable(record, makeLongType())).toBe(true);
    expect(isDistinguishable(record, makeDictionaryType())).toBe(false);
  });

  test("a callback interface type is dictionary-like", () => {
    const callbackInterface = makeCallbackInterfaceType();

    expect(isDistinguishable(callbackInterface, makeLongType())).toBe(true);
    expect(isDistinguishable(callbackInterface, makeDictionaryType())).toBe(
      false,
    );
  });

  test("a frozen array type is sequence-like", () => {
    expect(
      isDistinguishable(
        makeSequenceType(makeLongType()),
        makeFrozenArrayType(makeLongType()),
      ),
    ).toBe(false);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#dfn-distinguishable
 *
 * Requirement (c) below the table: a callback function is told apart from a
 * dictionary-like type by whether the value is callable — but a callback
 * function declared [LegacyTreatNonObjectAsNull] also accepts values that are
 * not objects, so it overlaps with the dictionary-like conversion and the two
 * stop being distinguishable.
 */
describe("isDistinguishable - a callback function against a dictionary-like type", () => {
  test("a plain callback function is distinguishable from a dictionary type", () => {
    expect(
      isDistinguishable(makeCallbackFunctionType(), makeDictionaryType()),
    ).toBe(true);
    expect(
      isDistinguishable(makeDictionaryType(), makeCallbackFunctionType()),
    ).toBe(true);
  });

  test("a [LegacyTreatNonObjectAsNull] callback function is not", () => {
    const callback = makeAnnotatedType(makeCallbackFunctionType(), {
      legacyTreatNonObjectAsNull: true,
    });

    expect(isDistinguishable(callback, makeDictionaryType())).toBe(false);
    expect(isDistinguishable(makeDictionaryType(), callback)).toBe(false);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#dfn-distinguishable
 *
 * Steps 2 and 3: a union is distinguishable from another type when every one of
 * its member types is. Neither union here includes a nullable type or a
 * dictionary, so the first step lets them through to these.
 */
describe("isDistinguishable - unions", () => {
  test("two unions whose member types are pairwise distinguishable", () => {
    const one = makeUnionType([makeInterfaceType(Interface1), makeLongType()]);
    const other = makeUnionType([
      makeInterfaceType(Interface2),
      makeDOMStringType(),
    ]);

    expect(isDistinguishable(one, other)).toBe(true);
  });

  test("two unions sharing a category in one member pair are not", () => {
    const one = makeUnionType([
      makeInterfaceType(Interface1),
      makeDOMStringType(),
    ]);
    const other = makeUnionType([
      makeInterfaceType(Interface2),
      makeUSVStringType(),
    ]);

    expect(isDistinguishable(one, other)).toBe(false);
  });

  test("a union against a type distinguishable from all its members", () => {
    const union = makeUnionType([
      makeInterfaceType(Interface1),
      makeDOMStringType(),
    ]);

    expect(isDistinguishable(union, makeLongType())).toBe(true);
    expect(isDistinguishable(makeLongType(), union)).toBe(true);
  });

  test("a nullable union against a type distinguishable from all its members", () => {
    // The first step lets the pair through because the other type neither
    // includes a nullable type nor carries a dictionary; the union is then
    // unwrapped out of the nullable to compare its member types.
    const union = makeNullableType(
      makeUnionType([makeInterfaceType(Interface1), makeDOMStringType()]),
    );

    expect(isDistinguishable(union, makeLongType())).toBe(true);
  });

  test("a nullable union against a plain union", () => {
    const nullable = makeNullableType(
      makeUnionType([makeInterfaceType(Interface1), makeLongType()]),
    );
    const plain = makeUnionType([
      makeInterfaceType(Interface2),
      makeDOMStringType(),
    ]);

    expect(isDistinguishable(nullable, plain)).toBe(true);
    expect(isDistinguishable(plain, nullable)).toBe(true);
  });

  test("a union against a type sharing a category with one member", () => {
    const union = makeUnionType([
      makeInterfaceType(Interface1),
      makeDOMStringType(),
    ]);

    expect(isDistinguishable(union, makeUSVStringType())).toBe(false);
    expect(isDistinguishable(makeUSVStringType(), union)).toBe(false);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#dfn-distinguishable
 *
 * The last step decides by the table alone, so a type the table does not list
 * is distinguishable from nothing at all — the spec says as much of promise
 * types, and `any` is in the same position.
 */
describe("isDistinguishable - types the table does not list", () => {
  test("a promise type is not distinguishable from anything", () => {
    const promise = makePromiseType(makeLongType());

    expect(isDistinguishable(promise, makeDOMStringType())).toBe(false);
    expect(isDistinguishable(makeDOMStringType(), promise)).toBe(false);
  });

  test("any is not distinguishable from anything", () => {
    expect(isDistinguishable(makeAnyType(), makeDOMStringType())).toBe(false);
  });
});
