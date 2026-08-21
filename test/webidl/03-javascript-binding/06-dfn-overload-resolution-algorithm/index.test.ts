/**
 * @see https://webidl.spec.whatwg.org/#dfn-overload-resolution-algorithm
 *
 * `resolveOverloads` picks a callable from an effective overload set and
 * converts the JS arguments to IDL values for it: the set must be non-empty, an
 * argument count no entry accepts is rejected, the entry is chosen by the kind
 * of the value at the distinguishing argument index, each argument is converted
 * through its declared type in order, and surplus arguments are ignored.
 *
 * An optional argument that is omitted — passed as undefined, or not passed at
 * all — contributes its default value if it was declared with one. Where the
 * spec appends the special value "missing", a trailing run of such arguments is
 * left off the value list entirely, so that applying it to the method steps
 * passes no argument at all for them; one with a value after it keeps its
 * position and is passed as undefined.
 */
import { describe, expect, test } from "vitest";
import {
  resolveOverloads,
  type OperationEffectiveOverloadSet,
  type Operation,
  type Type,
} from "lib/webidl";

import { makeOperation } from "../../02-idl/05-idl-members/utils";
import {
  makeBooleanType,
  makeCallbackFunctionType,
  makeDOMStringType,
  makeDictionaryType,
  makeInterfaceType,
  makeLongType,
  makeNullableType,
  makeAsyncSequenceType,
  makeBigIntType,
  makeObjectType,
  makePlatformObject,
  makeSequenceType,
  makeUnionType,
} from "../../02-idl/13-idl-types/utils";

type Entry = [Operation, Type[], ("required" | "optional")[]];

/**
 * Assembles an effective overload set from entries given as written in the spec
 * examples, so a test can state the exact tuples the algorithm receives without
 * going through "compute the effective overload set".
 */
function overloads(...entries: Entry[]): OperationEffectiveOverloadSet {
  return new Set(entries) as unknown as OperationEffectiveOverloadSet;
}

function overloadSet(
  typeList: Type[],
  callable: Operation = makeOperation({ identifier: "op" }),
): OperationEffectiveOverloadSet {
  return new Set([
    [callable, typeList, typeList.map(() => "required" as const)],
  ]) as unknown as OperationEffectiveOverloadSet;
}

describe("resolveOverloads", () => {
  test("throws for an empty effective overload set", () => {
    const empty = new Set() as unknown as OperationEffectiveOverloadSet;

    expect(() => resolveOverloads(empty, [])).toThrow(/empty/i);
  });

  test("returns the set's callable alongside the converted values", () => {
    const op = makeOperation({ identifier: "op" });
    const S = overloadSet([makeLongType()], op);

    const [callable, values] = resolveOverloads(S, ["4"]);

    expect(callable).toBe(op);
    expect(values).toEqual([4]);
  });

  test("converts each argument through its own type, in order", () => {
    const S = overloadSet([makeLongType(), makeDOMStringType()]);

    const [, values] = resolveOverloads(S, ["7", 42]);

    expect(values).toEqual([7, "42"]);
  });

  test("ignores arguments beyond the type list length", () => {
    const S = overloadSet([makeLongType()]);

    const [, values] = resolveOverloads(S, ["1", "2", "3"]);

    expect(values).toEqual([1]);
  });

  test("accepts a zero-length type list with no arguments", () => {
    const op = makeOperation({ identifier: "op" });
    const S = overloadSet([], op);

    const [callable, values] = resolveOverloads(S, []);

    expect(callable).toBe(op);
    expect(values).toEqual([]);
  });

  test("throws when fewer arguments than the type list are supplied", () => {
    const S = overloadSet([makeLongType()]);

    expect(() => resolveOverloads(S, [])).toThrow(
      /at least 1 argument required, but only 0 passed/i,
    );
  });

  test("pluralises the argument count in the too-few-arguments error", () => {
    const S = overloadSet([makeLongType(), makeLongType()]);

    expect(() => resolveOverloads(S, ["1"])).toThrow(
      /at least 2 arguments required, but only 1 passed/i,
    );
  });
});

describe("resolveOverloads - omitted optional arguments", () => {
  test("uses the default value when the argument is not passed at all", () => {
    const longType = makeLongType();
    const stringType = makeDOMStringType();
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        { type: longType, identifier: "x" },
        {
          type: stringType,
          identifier: "label",
          keywords: ["optional"],
          defaultValue: "auto",
        },
      ],
    });
    const S = overloads(
      [op, [longType, stringType], ["required", "optional"]],
      [op, [longType], ["required"]],
    );

    const [, values] = resolveOverloads(S, ["7"]);

    expect(values).toEqual([7, "auto"]);
  });

  test("leaves off a trailing argument that has no default value", () => {
    const longType = makeLongType();
    const stringType = makeDOMStringType();
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        { type: longType, identifier: "x" },
        { type: stringType, identifier: "label", keywords: ["optional"] },
      ],
    });
    const S = overloads(
      [op, [longType, stringType], ["required", "optional"]],
      [op, [longType], ["required"]],
    );

    const [, values] = resolveOverloads(S, ["7"]);

    expect(values).toEqual([7]);
  });

  test("uses the default value when the argument is passed as undefined", () => {
    const longType = makeLongType();
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        {
          type: longType,
          identifier: "x",
          keywords: ["optional"],
          defaultValue: 42,
        },
      ],
    });
    const S = overloads([op, [longType], ["optional"]], [op, [], []]);

    const [, values] = resolveOverloads(S, [undefined]);

    expect(values).toEqual([42]);
  });

  test("leaves off an undefined passed to a trailing argument without a default", () => {
    const longType = makeLongType();
    const op = makeOperation({
      identifier: "draw",
      arguments: [{ type: longType, identifier: "x", keywords: ["optional"] }],
    });
    const S = overloads([op, [longType], ["optional"]], [op, [], []]);

    const [, values] = resolveOverloads(S, [undefined]);

    expect(values).toEqual([]);
  });

  test("converts an undefined passed to a required argument rather than omitting it", () => {
    const longType = makeLongType();
    const op = makeOperation({
      identifier: "draw",
      arguments: [{ type: longType, identifier: "x" }],
    });
    const S = overloads([op, [longType], ["required"]]);

    const [, values] = resolveOverloads(S, [undefined]);

    expect(values).toEqual([0]);
  });

  test("keeps the position of an argument declared with the undefined default value", () => {
    // The `undefined` token is a valid default value, and an argument declared
    // with it holds its position — which is what tells it apart from an argument
    // declared with no default at all, whose position is dropped.
    const longType = makeLongType();
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        {
          type: longType,
          identifier: "x",
          keywords: ["optional"],
          defaultValue: undefined,
        },
      ],
    });
    const S = overloads([op, [longType], ["optional"]], [op, [], []]);

    const [, values] = resolveOverloads(S, []);

    expect(values).toEqual([undefined]);
  });

  test("omits each trailing optional argument independently", () => {
    const longType = makeLongType();
    const stringType = makeDOMStringType();
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        { type: longType, identifier: "x", keywords: ["optional"] },
        {
          type: stringType,
          identifier: "label",
          keywords: ["optional"],
          defaultValue: "auto",
        },
      ],
    });
    const S = overloads(
      [op, [longType, stringType], ["optional", "optional"]],
      [op, [longType], ["optional"]],
      [op, [], []],
    );

    expect(resolveOverloads(S, [])[1]).toEqual([undefined, "auto"]);
    expect(resolveOverloads(S, ["1"])[1]).toEqual([1, "auto"]);
    expect(resolveOverloads(S, ["1", 2])[1]).toEqual([1, "2"]);
  });

  test("keeps the hole in the middle of the value list", () => {
    // An omitted argument followed by a supplied one cannot be dropped without
    // shifting that value into its place, so it holds its position as undefined.
    const longType = makeLongType();
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        { type: longType, identifier: "x", keywords: ["optional"] },
        { type: longType, identifier: "y", keywords: ["optional"] },
      ],
    });
    const S = overloads(
      [op, [longType, longType], ["optional", "optional"]],
      [op, [longType], ["optional"]],
      [op, [], []],
    );

    const [, values] = resolveOverloads(S, [undefined, "5"]);

    expect(values).toEqual([undefined, 5]);
  });
});

describe("resolveOverloads - a missing argument that is not trailing", () => {
  test("holds its position when a required argument follows", () => {
    // Nothing in the spec forbids a required argument after an optional one, so
    // the omitted argument keeps its place rather than shifting `b` into it.
    const longType = makeLongType();
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        { type: longType, identifier: "a", keywords: ["optional"] },
        { type: longType, identifier: "b" },
      ],
    });
    const S = overloads([op, [longType, longType], ["optional", "required"]]);

    const [, values] = resolveOverloads(S, [undefined, "5"]);

    expect(values).toEqual([undefined, 5]);
  });

  test("holds its position when an argument with a default follows", () => {
    // Both arguments are omitted, but the second contributes its default value,
    // so the first is not a trailing "missing" and is passed as undefined.
    const longType = makeLongType();
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        { type: longType, identifier: "a", keywords: ["optional"] },
        {
          type: longType,
          identifier: "b",
          keywords: ["optional"],
          defaultValue: 5,
        },
      ],
    });
    const S = overloads(
      [op, [longType, longType], ["optional", "optional"]],
      [op, [longType], ["optional"]],
      [op, [], []],
    );

    const [, values] = resolveOverloads(S, []);

    expect(values).toEqual([undefined, 5]);
  });

  test("drops the whole trailing run at once", () => {
    const longType = makeLongType();
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        { type: longType, identifier: "a" },
        { type: longType, identifier: "b", keywords: ["optional"] },
        { type: longType, identifier: "c", keywords: ["optional"] },
      ],
    });
    const S = overloads(
      [
        op,
        [longType, longType, longType],
        ["required", "optional", "optional"],
      ],
      [op, [longType, longType], ["required", "optional"]],
      [op, [longType], ["required"]],
    );

    const [, values] = resolveOverloads(S, ["1"]);

    expect(values).toEqual([1]);
  });
});

class Node {}

describe("resolveOverloads - choosing between overloads", () => {
  const op = () => makeOperation({ identifier: "f" });

  test("picks the overload whose argument count matches", () => {
    const longType = makeLongType();
    const one = op();
    const two = op();
    const S = overloads(
      [one, [longType], ["required"]],
      [two, [longType, longType], ["required", "required"]],
    );

    expect(resolveOverloads(S, ["1"])[0]).toBe(one);
    expect(resolveOverloads(S, ["1", "2"])[0]).toBe(two);
  });

  test("distinguishes a string argument from an interface one", () => {
    const stringOverload = op();
    const nodeOverload = op();
    const S = overloads(
      [stringOverload, [makeDOMStringType()], ["required"]],
      [nodeOverload, [makeInterfaceType(Node)], ["required"]],
    );

    expect(resolveOverloads(S, ["text"])[0]).toBe(stringOverload);
    expect(resolveOverloads(S, [new Node()])[0]).toBe(nodeOverload);
  });

  test("prefers the entry marked optional when undefined is passed", () => {
    const optionalOverload = makeOperation({
      identifier: "f",
      arguments: [
        { type: makeLongType(), identifier: "n", keywords: ["optional"] },
      ],
    });
    const stringOverload = op();
    const S = overloads(
      [optionalOverload, [makeLongType()], ["optional"]],
      [stringOverload, [makeDOMStringType()], ["required"]],
    );

    expect(resolveOverloads(S, [undefined])[0]).toBe(optionalOverload);
  });

  test("prefers a nullable type when null is passed", () => {
    const nullableOverload = op();
    const longOverload = op();
    const S = overloads(
      [nullableOverload, [makeNullableType(makeDOMStringType())], ["required"]],
      [longOverload, [makeLongType()], ["required"]],
    );

    expect(resolveOverloads(S, [null])[0]).toBe(nullableOverload);
  });

  test("prefers a dictionary type when null is passed", () => {
    const dictionaryOverload = op();
    const longOverload = op();
    const S = overloads(
      [dictionaryOverload, [makeDictionaryType()], ["required"]],
      [longOverload, [makeLongType()], ["required"]],
    );

    expect(resolveOverloads(S, [null])[0]).toBe(dictionaryOverload);
  });

  test("prefers object for a platform object", () => {
    const objectOverload = op();
    const longOverload = op();
    const S = overloads(
      [objectOverload, [makeObjectType()], ["required"]],
      [longOverload, [makeLongType()], ["required"]],
    );

    expect(resolveOverloads(S, [makePlatformObject()])[0]).toBe(objectOverload);
  });

  test("prefers a callback function for a callable value", () => {
    const callbackOverload = op();
    const stringOverload = op();
    const S = overloads(
      [callbackOverload, [makeCallbackFunctionType()], ["required"]],
      [stringOverload, [makeDOMStringType()], ["required"]],
    );

    expect(resolveOverloads(S, [() => undefined])[0]).toBe(callbackOverload);
  });

  test("prefers a sequence for an iterable object and converts it", () => {
    const sequenceOverload = op();
    const stringOverload = op();
    const sequenceType = makeSequenceType(makeLongType());
    const S = overloads(
      [sequenceOverload, [sequenceType], ["required"]],
      [stringOverload, [makeDOMStringType()], ["required"]],
    );

    const [callable, values] = resolveOverloads(S, [["1", "2"]]);

    expect(callable).toBe(sequenceOverload);
    expect(values).toEqual([[1, 2]]);
  });

  test("prefers a dictionary for a plain object", () => {
    const dictionaryOverload = op();
    const longOverload = op();
    const S = overloads(
      [dictionaryOverload, [makeDictionaryType()], ["required"]],
      [longOverload, [makeLongType()], ["required"]],
    );

    expect(resolveOverloads(S, [{}])[0]).toBe(dictionaryOverload);
  });

  test("prefers boolean for a boolean value", () => {
    const booleanOverload = op();
    const stringOverload = op();
    const S = overloads(
      [booleanOverload, [makeBooleanType()], ["required"]],
      [stringOverload, [makeDOMStringType()], ["required"]],
    );

    expect(resolveOverloads(S, [true])[0]).toBe(booleanOverload);
  });

  test("prefers a numeric type for a number", () => {
    const longOverload = op();
    const stringOverload = op();
    const S = overloads(
      [longOverload, [makeLongType()], ["required"]],
      [stringOverload, [makeDOMStringType()], ["required"]],
    );

    expect(resolveOverloads(S, [12])[0]).toBe(longOverload);
  });

  test("falls back to a string type for a value of no matching kind", () => {
    // A symbol matches none of the value-kind branches, so the string type wins
    // the fallback — which the conversion of a symbol to a string then reports.
    const S = overloads(
      [op(), [makeDOMStringType()], ["required"]],
      [op(), [makeBooleanType()], ["required"]],
    );

    expect(() => resolveOverloads(S, [Symbol("s")])).toThrow(/symbol/i);
  });

  test("throws when no overload accepts the distinguishing argument", () => {
    const S = overloads(
      [op(), [makeInterfaceType(Node)], ["required"]],
      [op(), [makeDictionaryType()], ["required"]],
    );

    expect(() => resolveOverloads(S, [Symbol("s")])).toThrow(
      /No overload accepts/,
    );
  });

  test("converts the arguments before the distinguishing index once", () => {
    const longType = makeLongType();
    const stringOverload = op();
    const nodeOverload = op();
    const S = overloads(
      [
        stringOverload,
        [longType, makeDOMStringType()],
        ["required", "required"],
      ],
      [
        nodeOverload,
        [longType, makeInterfaceType(Node)],
        ["required", "required"],
      ],
    );

    const [callable, values] = resolveOverloads(S, ["7", "text"]);

    expect(callable).toBe(stringOverload);
    expect(values).toEqual([7, "text"]);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#dfn-overload-resolution-algorithm
 *
 * The branches of the distinguishing step the shorter examples above do not
 * reach: the kind of the value is inspected before the type lists are, so a
 * BigInt, an async iterable and a buffer source each select their own entry.
 */
describe("resolveOverloads - the remaining distinguishing branches", () => {
  const op = () => makeOperation({ identifier: "f" });

  test("prefers a nullable type for undefined when no entry is optional", () => {
    // The optionality step comes first, but only an entry whose optionality
    // value at the index is "optional" answers to it; otherwise undefined is
    // treated like null.
    const nullableOverload = op();
    const longOverload = op();
    const S = overloads(
      [nullableOverload, [makeNullableType(makeDOMStringType())], ["required"]],
      [longOverload, [makeLongType()], ["required"]],
    );

    expect(resolveOverloads(S, [undefined])[0]).toBe(nullableOverload);
  });

  test("falls through to a string type for null when no entry accepts it as null", () => {
    const stringOverload = op();
    const longOverload = op();
    const S = overloads(
      [stringOverload, [makeDOMStringType()], ["required"]],
      [longOverload, [makeInterfaceType(Node)], ["required"]],
    );

    const [callable, values] = resolveOverloads(S, [null]);

    expect(callable).toBe(stringOverload);
    expect(values).toEqual(["null"]);
  });

  test("prefers bigint for a BigInt value", () => {
    const bigintOverload = op();
    const stringOverload = op();
    const S = overloads(
      [bigintOverload, [makeBigIntType()], ["required"]],
      [stringOverload, [makeDOMStringType()], ["required"]],
    );

    expect(resolveOverloads(S, [1n])[0]).toBe(bigintOverload);
  });

  test("prefers an async sequence for an object with an async iterator", () => {
    const asyncOverload = op();
    const longOverload = op();
    const S = overloads(
      [asyncOverload, [makeAsyncSequenceType(makeLongType())], ["required"]],
      [longOverload, [makeLongType()], ["required"]],
    );
    const iterable = {
      async *[Symbol.asyncIterator]() {
        yield 1;
      },
    };

    const [callable, values] = resolveOverloads(S, [iterable]);

    expect(callable).toBe(asyncOverload);
    // The spec converts the distinguishing argument separately only for a
    // sequence type; an async sequence is converted like any other argument.
    expect(values).toEqual([iterable]);
  });

  test("does not take a String object as an async sequence when a string type is in the set", () => {
    const asyncOverload = op();
    const stringOverload = op();
    const S = overloads(
      [asyncOverload, [makeAsyncSequenceType(makeLongType())], ["required"]],
      [stringOverload, [makeDOMStringType()], ["required"]],
    );

    expect(resolveOverloads(S, [new String("ab")])[0]).toBe(stringOverload);
  });

  test("prefers object for a buffer source", () => {
    const objectOverload = op();
    const longOverload = op();
    const S = overloads(
      [objectOverload, [makeObjectType()], ["required"]],
      [longOverload, [makeLongType()], ["required"]],
    );

    expect(resolveOverloads(S, [new ArrayBuffer(1)])[0]).toBe(objectOverload);
    expect(resolveOverloads(S, [new DataView(new ArrayBuffer(1))])[0]).toBe(
      objectOverload,
    );
    expect(resolveOverloads(S, [new Uint8Array(1)])[0]).toBe(objectOverload);
  });

  test("throws when the argument count falls between the ones the entries take", () => {
    const longType = makeLongType();
    const S = overloads(
      [op(), [longType], ["required"]],
      [
        op(),
        [longType, longType, longType],
        ["required", "required", "required"],
      ],
    );

    expect(() => resolveOverloads(S, [1, 2])).toThrow(/no overload takes 2/i);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#dfn-overload-resolution-algorithm
 *
 * Step 11 converts the arguments before the distinguishing argument index,
 * where every entry agrees on the type and the optionality value, so an omitted
 * optional argument there is treated exactly as one after the index — except
 * that it can never be trailing, and so always keeps its position.
 */
describe("resolveOverloads - an optional argument before the distinguishing index", () => {
  const longType = makeLongType();

  function twoEntries(first: Operation, second: Operation) {
    return overloads(
      [first, [longType, makeDOMStringType()], ["optional", "required"]],
      [second, [longType, makeInterfaceType(Node)], ["optional", "required"]],
    );
  }

  test("passes undefined for one declared without a default value", () => {
    const stringOverload = makeOperation({
      identifier: "f",
      arguments: [
        { type: longType, identifier: "n", keywords: ["optional"] },
        { type: makeDOMStringType(), identifier: "label" },
      ],
    });
    const S = twoEntries(stringOverload, makeOperation({ identifier: "f" }));

    const [callable, values] = resolveOverloads(S, [undefined, "text"]);

    expect(callable).toBe(stringOverload);
    expect(values).toEqual([undefined, "text"]);
  });

  test("passes the default value of one declared with it", () => {
    const stringOverload = makeOperation({
      identifier: "f",
      arguments: [
        {
          type: longType,
          identifier: "n",
          keywords: ["optional"],
          defaultValue: 5,
        },
        { type: makeDOMStringType(), identifier: "label" },
      ],
    });
    const S = twoEntries(stringOverload, makeOperation({ identifier: "f" }));

    expect(resolveOverloads(S, [undefined, "text"])[1]).toEqual([5, "text"]);
  });

  test("converts a value that is passed", () => {
    const stringOverload = makeOperation({
      identifier: "f",
      arguments: [
        { type: longType, identifier: "n", keywords: ["optional"] },
        { type: makeDOMStringType(), identifier: "label" },
      ],
    });
    const S = twoEntries(stringOverload, makeOperation({ identifier: "f" }));

    expect(resolveOverloads(S, ["7", "text"])[1]).toEqual([7, "text"]);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#dfn-overload-resolution-algorithm
 *
 * Every branch of the distinguishing step is guarded twice: by the kind of the
 * value, and by an entry actually holding a matching type at the index. When
 * the kind matches but no entry does, the algorithm goes on to the next
 * branch — here all the way down to the string type of step 15, which takes
 * any value that got that far.
 */
describe("resolveOverloads - falling through a branch no entry answers", () => {
  const op = () => makeOperation({ identifier: "f" });

  function against(other: Type, V: unknown) {
    const stringOverload = op();
    const S = overloads(
      [stringOverload, [makeDOMStringType()], ["required"]],
      [op(), [other], ["required"]],
    );

    return resolveOverloads(S, [V])[0] === stringOverload;
  }

  test("a buffer source when no entry holds object", () => {
    expect(against(makeLongType(), new ArrayBuffer(1))).toBe(true);
  });

  test("a callable when no entry holds a callback function or object", () => {
    expect(against(makeLongType(), () => undefined)).toBe(true);
  });

  test("an object without an async iterator against an async sequence entry", () => {
    expect(against(makeAsyncSequenceType(makeLongType()), {})).toBe(true);
  });

  test("an object without an iterator against a sequence entry", () => {
    expect(against(makeSequenceType(makeLongType()), {})).toBe(true);
  });

  test("a boolean when no entry holds boolean", () => {
    expect(against(makeLongType(), true)).toBe(true);
  });

  test("a number when no entry holds a numeric type", () => {
    expect(against(makeBooleanType(), 5)).toBe(true);
  });

  test("a BigInt when no entry holds bigint", () => {
    expect(against(makeLongType(), 1n)).toBe(true);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#dfn-overload-resolution-algorithm
 *
 * A union at the distinguishing argument index answers for each of its
 * flattened member types, so the branch that matches is the one for the kind of
 * the value, not the one for "union".
 */
describe("resolveOverloads - a union at the distinguishing index", () => {
  const op = () => makeOperation({ identifier: "f" });

  test("matches through the member type the value belongs to", () => {
    const unionOverload = op();
    const interfaceOverload = op();
    const S = overloads(
      [
        unionOverload,
        [makeUnionType([makeLongType(), makeBooleanType()])],
        ["required"],
      ],
      [interfaceOverload, [makeInterfaceType(Node)], ["required"]],
    );

    expect(resolveOverloads(S, [5])[0]).toBe(unionOverload);
    expect(resolveOverloads(S, [true])[0]).toBe(unionOverload);
    expect(resolveOverloads(S, [new Node()])[0]).toBe(interfaceOverload);
  });
});
