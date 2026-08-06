/**
 * @see https://webidl.spec.whatwg.org/#dfn-overload-resolution-algorithm
 *
 * `resolveOverloads` picks a callable from an effective overload set and
 * converts the JS arguments to IDL values for it. With overloading not yet
 * modelled it takes the set's single entry, but it still enforces the invariants
 * shared with the full algorithm: the set must be non-empty, at least as many
 * arguments as the type list requires must be supplied, each argument is
 * converted through its declared type in order, and surplus arguments are
 * ignored.
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
