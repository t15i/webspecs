/**
 * @see https://webidl.spec.whatwg.org/#dfn-overload-resolution-algorithm
 *
 * `resolveOverloads` picks a callable from an effective overload set and
 * converts the JS arguments to IDL values for it. With overloading not yet
 * modelled exactly one entry survives the argument count filter, but it still
 * enforces the invariants shared with the full algorithm: the set must be
 * non-empty, an argument count no entry accepts is rejected, each argument is
 * converted through its declared type in order, and surplus arguments are
 * ignored.
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
  makeDOMStringType,
  makeLongType,
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
