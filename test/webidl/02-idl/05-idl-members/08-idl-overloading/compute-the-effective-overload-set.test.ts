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
 * (Overloading itself is not yet modelled — the algorithm only ever contributes
 * the operation's own single signature.)
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
    const iface = makeInterface({ members: { foo: op } });

    const S = computeEffectiveOverloadSet("regular", "foo", 2, iface);

    expect(S.size).toBe(1);
    const [callable, typeList, optionalityList] = [...S][0]!;
    expect(callable).toBe(op);
    expect(typeList).toEqual([longType, stringType]);
    expect(optionalityList).toEqual(["required", "required"]);
  });

  test("yields a zero-length type list for a no-argument operation", () => {
    const op = makeOperation({ identifier: "ping", argumentTypes: [] });
    const iface = makeInterface({ members: { ping: op } });

    const [, typeList, optionalityList] = [
      ...computeEffectiveOverloadSet("regular", "ping", 0, iface),
    ][0]!;

    expect(typeList).toEqual([]);
    expect(optionalityList).toEqual([]);
  });

  test("is empty when the interface has no member of that name", () => {
    const iface = makeInterface({
      members: { foo: makeOperation({ identifier: "foo" }) },
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
      members: { run: regular },
      staticMembers: {
        run: makeOperation({
          identifier: "run",
          keywords: ["static"],
          argumentTypes: [makeLongType()],
        }),
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
    const iface = makeInterface({ staticMembers: { make: op } });

    const S = computeEffectiveOverloadSet("static", "make", 1, iface);

    expect(S.size).toBe(1);
    expect([...S][0]![0]).toBe(op);
  });

  test("does not find a static operation among the instance members", () => {
    const iface = makeInterface({
      members: { make: makeOperation({ identifier: "make" }) },
    });

    expect(computeEffectiveOverloadSet("static", "make", 0, iface).size).toBe(
      0,
    );
  });
});

describe("computeEffectiveOverloadSet - constructor operations", () => {
  test("contributes the interface's own constructor operation", () => {
    const ctor = makeConstructor({ argumentTypes: [makeLongType()] });
    const iface = makeInterface({ members: { constructor: ctor } });

    const S = computeEffectiveOverloadSet("constructor", "Example", 1, iface);

    expect(S.size).toBe(1);
    const [callable, typeList, optionalityList] = [...S][0]!;
    expect(callable).toBe(ctor);
    expect(typeList).toHaveLength(1);
    expect(optionalityList).toEqual(["required"]);
  });

  test("is empty when the interface declares no constructor", () => {
    const iface = makeInterface({
      members: { foo: makeOperation({ identifier: "foo" }) },
    });

    expect(
      computeEffectiveOverloadSet("constructor", "Example", 0, iface).size,
    ).toBe(0);
  });
});
