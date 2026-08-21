/**
 * @see https://webidl.spec.whatwg.org/#compute-the-effective-overload-set
 *
 * The effective overload set is a set of tuples, each pairing a callable with a
 * type list and an optionality list. For a single (non-overloaded) operation of
 * arity A the set holds exactly one tuple whose callable is the operation, whose
 * type list is the operation's argument types in order, and whose optionality
 * list marks every argument "required". The set is empty when the requested
 * member does not exist or is not an operation/constructor.
 *
 * An optional argument can be left out at the call site, so an operation that
 * declares one stands for several allowable invocations: the set holds one tuple
 * per argument count the operation can be called with.
 *
 * When an identifier is overloaded its slot holds every operation declared under
 * it, and each of them contributes its own signatures to the same set.
 */
import { describe, expect, test } from "vitest";
import {
  computeEffectiveOverloadSet,
  Exposed,
  type Interface,
} from "lib/webidl";

import { makeAttribute, makeConstructor, makeOperation } from "../utils";
import { makeDOMStringType, makeLongType } from "../../13-idl-types/utils";

function makeInterface(overrides: Partial<Interface> = {}): Interface {
  return {
    identifier: "Example",
    extendedAttributes: { [Exposed]: "*" },
    inherit: null,
    staticMembers: {},
    behaviors: {},
    members: {},
    ...overrides,
  };
}

describe("computeEffectiveOverloadSet - regular operations", () => {
  test("contributes the operation's single signature", () => {
    const longType = makeLongType();
    const stringType = makeDOMStringType();
    const op = makeOperation({
      identifier: "foo",
      argumentTypes: [longType, stringType],
    });
    const iface = makeInterface({ members: { foo: [op] } });

    const S = computeEffectiveOverloadSet("regular", "foo", 2, iface);

    expect(S.size).toBe(1);
    const [callable, typeList, optionalityList] = [...S][0]!;
    expect(callable).toBe(op);
    expect(typeList).toEqual([longType, stringType]);
    expect(optionalityList).toEqual(["required", "required"]);
  });

  test("yields a zero-length type list for a no-argument operation", () => {
    const op = makeOperation({ identifier: "ping", argumentTypes: [] });
    const iface = makeInterface({ members: { ping: [op] } });

    const [, typeList, optionalityList] = [
      ...computeEffectiveOverloadSet("regular", "ping", 0, iface),
    ][0]!;

    expect(typeList).toEqual([]);
    expect(optionalityList).toEqual([]);
  });

  test("is empty when the interface has no member of that name", () => {
    const iface = makeInterface({
      members: { foo: [makeOperation({ identifier: "foo" })] },
    });

    expect(computeEffectiveOverloadSet("regular", "bar", 0, iface).size).toBe(
      0,
    );
  });

  test("is empty when the named member is an attribute, not an operation", () => {
    const iface = makeInterface({
      members: {
        foo: makeAttribute({ type: makeLongType(), identifier: "foo" }),
      },
    });

    expect(computeEffectiveOverloadSet("regular", "foo", 0, iface).size).toBe(
      0,
    );
  });

  test("reads regular operations from members, ignoring same-named static ones", () => {
    const regular = makeOperation({ identifier: "run", argumentTypes: [] });
    const iface = makeInterface({
      members: { run: [regular] },
      staticMembers: {
        run: [
          makeOperation({
            identifier: "run",
            keywords: ["static"],
            argumentTypes: [makeLongType()],
          }),
        ],
      },
    });

    const [callable] = [
      ...computeEffectiveOverloadSet("regular", "run", 0, iface),
    ][0]!;

    expect(callable).toBe(regular);
  });
});

describe("computeEffectiveOverloadSet - static operations", () => {
  test("reads the operation from the interface's static members", () => {
    const op = makeOperation({
      identifier: "make",
      keywords: ["static"],
      argumentTypes: [makeLongType()],
    });
    const iface = makeInterface({ staticMembers: { make: [op] } });

    const S = computeEffectiveOverloadSet("static", "make", 1, iface);

    expect(S.size).toBe(1);
    expect([...S][0]![0]).toBe(op);
  });

  test("does not find a static operation among the instance members", () => {
    const iface = makeInterface({
      members: { make: [makeOperation({ identifier: "make" })] },
    });

    expect(computeEffectiveOverloadSet("static", "make", 0, iface).size).toBe(
      0,
    );
  });
});

describe("computeEffectiveOverloadSet - constructor operations", () => {
  test("contributes the interface's own constructor operation", () => {
    const ctor = makeConstructor({ argumentTypes: [makeLongType()] });
    const iface = makeInterface({ members: { constructor: [ctor] } });

    const S = computeEffectiveOverloadSet("constructor", "Example", 1, iface);

    expect(S.size).toBe(1);
    const [callable, typeList, optionalityList] = [...S][0]!;
    expect(callable).toBe(ctor);
    expect(typeList).toHaveLength(1);
    expect(optionalityList).toEqual(["required"]);
  });

  test("is empty when the interface declares no constructor", () => {
    const iface = makeInterface({
      members: { foo: [makeOperation({ identifier: "foo" })] },
    });

    expect(
      computeEffectiveOverloadSet("constructor", "Example", 0, iface).size,
    ).toBe(0);
  });
});

describe("computeEffectiveOverloadSet - optional arguments", () => {
  test("contributes one tuple per allowable argument count", () => {
    const longType = makeLongType();
    const stringType = makeDOMStringType();
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        { type: longType, identifier: "x" },
        { type: stringType, identifier: "label", keywords: ["optional"] },
      ],
    });
    const iface = makeInterface({ members: { draw: [op] } });

    const S = computeEffectiveOverloadSet("regular", "draw", 2, iface);

    expect([...S].map(([, typeList]) => typeList)).toEqual([
      [longType, stringType],
      [longType],
    ]);
  });

  test('marks an optional argument "optional" in the optionality list', () => {
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        { type: makeLongType(), identifier: "x" },
        {
          type: makeDOMStringType(),
          identifier: "label",
          keywords: ["optional"],
        },
      ],
    });
    const iface = makeInterface({ members: { draw: [op] } });

    const S = computeEffectiveOverloadSet("regular", "draw", 2, iface);

    expect([...S].map(([, , optionality]) => optionality)).toEqual([
      ["required", "optional"],
      ["required"],
    ]);
  });

  test("contributes the empty invocation when every argument is optional", () => {
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        { type: makeLongType(), identifier: "x", keywords: ["optional"] },
        { type: makeLongType(), identifier: "y", keywords: ["optional"] },
      ],
    });
    const iface = makeInterface({ members: { draw: [op] } });

    const S = computeEffectiveOverloadSet("regular", "draw", 2, iface);

    expect([...S].map(([, typeList]) => typeList.length)).toEqual([2, 1, 0]);
  });

  test("stops truncating at the first argument that is not optional", () => {
    // Only trailing arguments can be omitted: an optional argument followed by a
    // required one is never left out on its own.
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        { type: makeLongType(), identifier: "x", keywords: ["optional"] },
        { type: makeLongType(), identifier: "y" },
      ],
    });
    const iface = makeInterface({ members: { draw: [op] } });

    const S = computeEffectiveOverloadSet("regular", "draw", 2, iface);

    expect([...S].map(([, typeList]) => typeList.length)).toEqual([2]);
  });

  test("is unaffected by the requested argument count", () => {
    const op = makeOperation({
      identifier: "draw",
      arguments: [
        { type: makeLongType(), identifier: "x", keywords: ["optional"] },
      ],
    });
    const iface = makeInterface({ members: { draw: [op] } });

    for (const n of [0, 1, 5]) {
      const S = computeEffectiveOverloadSet("regular", "draw", n, iface);

      expect([...S].map(([, typeList]) => typeList.length)).toEqual([1, 0]);
    }
  });

  test("truncates the optional arguments of a constructor operation too", () => {
    const ctor = makeConstructor({
      arguments: [
        { type: makeLongType(), identifier: "width" },
        { type: makeLongType(), identifier: "height", keywords: ["optional"] },
      ],
    });
    const iface = makeInterface({ members: { constructor: [ctor] } });

    const S = computeEffectiveOverloadSet("constructor", "Example", 2, iface);

    expect([...S].map(([, typeList]) => typeList.length)).toEqual([2, 1]);
    expect([...S].every(([callable]) => callable === ctor)).toBe(true);
  });
});

describe("computeEffectiveOverloadSet - overloaded operations", () => {
  test("contributes the signatures of every overload under the identifier", () => {
    const longType = makeLongType();
    const stringType = makeDOMStringType();
    const f1 = makeOperation({
      identifier: "f",
      argumentTypes: [stringType],
    });
    const f2 = makeOperation({
      identifier: "f",
      argumentTypes: [longType, stringType],
    });
    const f3 = makeOperation({ identifier: "f", argumentTypes: [] });
    const iface = makeInterface({ members: { f: [f1, f2, f3] } });

    const S = computeEffectiveOverloadSet("regular", "f", 2, iface);

    expect([...S]).toEqual([
      [f1, [stringType], ["required"]],
      [f2, [longType, stringType], ["required", "required"]],
      [f3, [], []],
    ]);
  });

  test("expands the optional arguments of each overload separately", () => {
    const longType = makeLongType();
    const stringType = makeDOMStringType();
    const f1 = makeOperation({
      identifier: "f",
      arguments: [
        { type: stringType, identifier: "a" },
        { type: stringType, identifier: "b", keywords: ["optional"] },
      ],
    });
    const f2 = makeOperation({
      identifier: "f",
      arguments: [{ type: longType, identifier: "n" }],
    });
    const iface = makeInterface({ members: { f: [f1, f2] } });

    const S = computeEffectiveOverloadSet("regular", "f", 2, iface);

    expect([...S].map(([callable, typeList]) => [callable, typeList])).toEqual([
      [f1, [stringType, stringType]],
      [f1, [stringType]],
      [f2, [longType]],
    ]);
  });

  test("reads overloaded static operations from the static members", () => {
    const one = makeOperation({
      identifier: "make",
      keywords: ["static"],
      argumentTypes: [makeLongType()],
    });
    const two = makeOperation({
      identifier: "make",
      keywords: ["static"],
      argumentTypes: [],
    });
    const iface = makeInterface({ staticMembers: { make: [one, two] } });

    const S = computeEffectiveOverloadSet("static", "make", 1, iface);

    expect([...S].map(([callable]) => callable)).toEqual([one, two]);
  });

  test("contributes every overload of a constructor operation", () => {
    const one = makeConstructor({ argumentTypes: [makeLongType()] });
    const two = makeConstructor({ argumentTypes: [] });
    const iface = makeInterface({ members: { constructor: [one, two] } });

    const S = computeEffectiveOverloadSet("constructor", "Example", 1, iface);

    expect([...S].map(([callable]) => callable)).toEqual([one, two]);
  });

  test("is empty for a slot holding no operations at all", () => {
    const iface = makeInterface({ members: { f: [] } });

    expect(computeEffectiveOverloadSet("regular", "f", 0, iface).size).toBe(0);
  });
});
