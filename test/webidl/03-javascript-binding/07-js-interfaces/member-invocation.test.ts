/**
 * @see https://webidl.spec.whatwg.org/#dfn-attribute-getter
 * @see https://webidl.spec.whatwg.org/#dfn-attribute-setter
 * @see https://webidl.spec.whatwg.org/#dfn-create-operation-function
 *
 * Runtime behaviour of the accessor and operation functions defined on an
 * interface prototype object: a regular member checks that `this` implements
 * the interface (throwing "Illegal invocation" otherwise), converts JS values
 * to IDL values on the way in, and forwards `this` to the member's steps. A
 * member whose type/return is a promise turns a synchronous throw into a
 * rejected promise.
 *
 * The prototype is assembled directly from the "define the regular
 * attributes/operations" algorithms, which is what an interface prototype
 * object would install on itself.
 */
import { describe, expect, test } from "vitest";
import {
  LegacyUnforgeable,
  defineRegularAttributes,
  defineRegularOperations,
  defineUnforgeableRegularAttributes,
  defineUnforgeableRegularOperations,
  type Interface,
  type Operation,
  type Type,
} from "lib/webidl";

import { makeInterface } from "./utils";
import {
  makeAttribute,
  makeOperation,
} from "../../02-idl/05-idl-members/utils";
import {
  associateInterface,
  makeDOMStringType,
  makeLongType,
  makePromiseType,
  makeUnsignedLongType,
} from "../../02-idl/13-idl-types/utils";

const store = new WeakMap<object, number>();

function readCount(this: object): number {
  return store.get(this) ?? -1;
}

function writeCount(this: object, value: number): void {
  store.set(this, value);
}

/** Builds a prototype-like object carrying the interface's regular members. */
function prototypeOf(iface: Interface): object {
  const proto = {};
  defineRegularAttributes(iface, proto);
  defineRegularOperations(iface, proto);
  return proto;
}

function getterOf(proto: object, key: string): () => unknown {
  return Object.getOwnPropertyDescriptor(proto, key)!.get!;
}

function setterOf(proto: object, key: string): (value: unknown) => void {
  return Object.getOwnPropertyDescriptor(proto, key)!.set!;
}

function methodOf(proto: object, key: string): (...args: unknown[]) => unknown {
  return Object.getOwnPropertyDescriptor(proto, key)!.value as (
    ...args: unknown[]
  ) => unknown;
}

describe("regular attribute accessors", () => {
  test("the getter forwards the this value to the getter steps", () => {
    const iface = makeInterface({
      members: {
        count: makeAttribute({
          type: makeLongType(),
          identifier: "count",
          getterSteps: readCount,
          setterSteps: writeCount,
        }),
      },
    });
    const proto = prototypeOf(iface);
    const instance = associateInterface(Object.create(proto), iface);
    store.set(instance, 7);

    expect((instance as { count: number }).count).toBe(7);
  });

  test("the setter converts the value to IDL and writes through this", () => {
    const iface = makeInterface({
      members: {
        count: makeAttribute({
          type: makeLongType(),
          identifier: "count",
          getterSteps: readCount,
          setterSteps: writeCount,
        }),
      },
    });
    const proto = prototypeOf(iface);
    const instance = associateInterface(Object.create(proto), iface);

    (instance as { count: unknown }).count = "9"; // converted via long → 9

    expect(store.get(instance)).toBe(9);
  });

  test("the getter throws Illegal invocation for a foreign this", () => {
    const iface = makeInterface({
      members: {
        count: makeAttribute({
          type: makeLongType(),
          identifier: "count",
          keywords: ["readonly"],
          getterSteps: readCount,
        }),
      },
    });
    const getter = getterOf(prototypeOf(iface), "count");

    expect(() => getter.call({})).toThrow(TypeError);
  });

  test("the setter throws Illegal invocation for a foreign this", () => {
    const iface = makeInterface({
      members: {
        count: makeAttribute({
          type: makeLongType(),
          identifier: "count",
          getterSteps: readCount,
          setterSteps: writeCount,
        }),
      },
    });
    const setter = setterOf(prototypeOf(iface), "count");

    expect(() => setter.call({}, 1)).toThrow(TypeError);
  });
});

describe("regular operations", () => {
  test("converts arguments to IDL and invokes the method steps on this", () => {
    const calls: Array<{ self: unknown; arg: unknown }> = [];
    const iface = makeInterface({
      members: {
        add: [
          makeOperation({
            identifier: "add",
            argumentTypes: [makeLongType()],
            methodSteps(this: unknown, n: unknown) {
              calls.push({ self: this, arg: n });
              return n;
            },
          }),
        ],
      },
    });
    const proto = prototypeOf(iface);
    const instance = associateInterface(Object.create(proto), iface);

    const result = (instance as { add: (n: unknown) => unknown }).add("4");

    expect(result).toBe(4);
    expect(calls).toEqual([{ self: instance, arg: 4 }]);
  });

  test("throws Illegal invocation for a foreign this", () => {
    const iface = makeInterface({
      members: {
        add: [
          makeOperation({
            identifier: "add",
            argumentTypes: [makeLongType()],
            methodSteps: () => undefined,
          }),
        ],
      },
    });
    const method = methodOf(prototypeOf(iface), "add");

    expect(() => method.call({}, 1)).toThrow(TypeError);
  });

  test("throws when fewer arguments than required are passed", () => {
    // Overload resolution requires at least the operation's argument count; a
    // short call is reported as a TypeError naming the operation and interface.
    const iface = makeInterface({
      identifier: "Calculator",
      members: {
        add: [
          makeOperation({
            identifier: "add",
            argumentTypes: [makeLongType()],
            methodSteps: () => undefined,
          }),
        ],
      },
    });
    const proto = prototypeOf(iface);
    const instance = associateInterface(Object.create(proto), iface);
    const add = (instance as { add: (...a: unknown[]) => unknown }).add;

    expect(() => add.call(instance)).toThrow(
      /Failed to execute 'add' on 'Calculator'/,
    );
    expect(() => add.call(instance)).toThrow(/at least 1 argument/i);
  });

  test("ignores arguments beyond the operation's declared count", () => {
    const seen: unknown[] = [];
    const iface = makeInterface({
      members: {
        one: [
          makeOperation({
            identifier: "one",
            argumentTypes: [makeLongType()],
            methodSteps(this: unknown, ...args: unknown[]) {
              seen.push(...args);
              return undefined;
            },
          }),
        ],
      },
    });
    const proto = prototypeOf(iface);
    const instance = associateInterface(Object.create(proto), iface);

    (instance as { one: (...a: unknown[]) => unknown }).one("1", "2", "3");

    // Only the single declared long argument is converted and forwarded.
    expect(seen).toEqual([1]);
  });
});

describe("promise-typed members reject rather than throw", () => {
  test("a promise-typed operation returns a rejected promise on illegal invocation", async () => {
    const iface = makeInterface({
      members: {
        load: [
          makeOperation({
            identifier: "load",
            returnType: makePromiseType(makeLongType()),
            methodSteps: () => Promise.resolve(1),
          }),
        ],
      },
    });
    const method = methodOf(prototypeOf(iface), "load");

    await expect(method.call({}) as Promise<unknown>).rejects.toThrow(
      TypeError,
    );
  });

  test("a promise-typed attribute getter returns a rejected promise on illegal invocation", async () => {
    const iface = makeInterface({
      members: {
        ready: makeAttribute({
          type: makePromiseType(makeLongType()),
          identifier: "ready",
          keywords: ["readonly"],
          getterSteps: () => Promise.resolve(1),
        }),
      },
    });
    const getter = getterOf(prototypeOf(iface), "ready");

    await expect(getter.call({}) as Promise<unknown>).rejects.toThrow(
      TypeError,
    );
  });
});

describe("optional arguments of an operation", () => {
  /** Builds an interface whose single operation takes one optional argument. */
  function withOptionalLabel(
    label: { keywords: string[]; defaultValue?: unknown },
    methodSteps: Operation["methodSteps"],
  ): Interface {
    return makeInterface({
      identifier: "Painter",
      members: {
        draw: [
          makeOperation({
            identifier: "draw",
            arguments: [
              { type: makeLongType(), identifier: "x" },
              { type: makeDOMStringType(), identifier: "label", ...label },
            ],
            methodSteps,
          }),
        ],
      },
    });
  }

  test("the function's length counts only the required arguments", () => {
    const iface = withOptionalLabel(
      { keywords: ["optional"] },
      () => undefined,
    );

    expect(methodOf(prototypeOf(iface), "draw").length).toBe(1);
  });

  test("the function's length is the declared arity when nothing is optional", () => {
    const iface = withOptionalLabel({ keywords: [] }, () => undefined);

    expect(methodOf(prototypeOf(iface), "draw").length).toBe(2);
  });

  test("an omitted optional argument reaches the method steps as its default value", () => {
    const seen: unknown[] = [];
    const iface = withOptionalLabel(
      { keywords: ["optional"], defaultValue: "auto" },
      (...args: unknown[]) => {
        seen.push(...args);
        return undefined;
      },
    );
    const proto = prototypeOf(iface);
    const instance = associateInterface(Object.create(proto), iface);

    (instance as { draw: (...a: unknown[]) => unknown }).draw("3");

    expect(seen).toEqual([3, "auto"]);
  });

  test("an omitted optional argument without a default is not passed to the method steps at all", () => {
    const seen: unknown[] = [];
    const iface = withOptionalLabel(
      { keywords: ["optional"] },
      (...args: unknown[]) => {
        seen.push(...args);
        return undefined;
      },
    );
    const proto = prototypeOf(iface);
    const instance = associateInterface(Object.create(proto), iface);

    (instance as { draw: (...a: unknown[]) => unknown }).draw("3");

    expect(seen).toEqual([3]);
  });

  test("a supplied optional argument is converted like any other", () => {
    const seen: unknown[] = [];
    const iface = withOptionalLabel(
      { keywords: ["optional"], defaultValue: "auto" },
      (...args: unknown[]) => {
        seen.push(...args);
        return undefined;
      },
    );
    const proto = prototypeOf(iface);
    const instance = associateInterface(Object.create(proto), iface);

    (instance as { draw: (...a: unknown[]) => unknown }).draw("3", 12);

    expect(seen).toEqual([3, "12"]);
  });

  test("the required arguments before an optional one are still enforced", () => {
    const iface = withOptionalLabel(
      { keywords: ["optional"] },
      () => undefined,
    );
    const proto = prototypeOf(iface);
    const instance = associateInterface(Object.create(proto), iface);
    const draw = (instance as { draw: (...a: unknown[]) => unknown }).draw;

    expect(() => draw.call(instance)).toThrow(/at least 1 argument/i);
  });
});

describe("overloaded operations on the prototype", () => {
  test("an overloaded identifier gets a single property", () => {
    const iface = makeInterface({
      members: {
        f: [
          makeOperation({ identifier: "f", argumentTypes: [makeLongType()] }),
          makeOperation({ identifier: "f", argumentTypes: [] }),
        ],
      },
    });

    const proto = prototypeOf(iface);

    expect(Object.getOwnPropertyNames(proto)).toEqual(["f"]);
    expect(typeof methodOf(proto, "f")).toBe("function");
  });

  test("dispatches to the overload the argument selects", () => {
    const calls: string[] = [];
    const iface = makeInterface({
      identifier: "Painter",
      members: {
        f: [
          makeOperation({
            identifier: "f",
            arguments: [{ type: makeDOMStringType(), identifier: "label" }],
            methodSteps(...args: unknown[]) {
              calls.push(`string:${String(args[0])}`);
              return undefined;
            },
          }),
          makeOperation({
            identifier: "f",
            arguments: [{ type: makeLongType(), identifier: "n" }],
            methodSteps(...args: unknown[]) {
              calls.push(`long:${String(args[0])}`);
              return undefined;
            },
          }),
        ],
      },
    });
    const proto = prototypeOf(iface);
    const instance = associateInterface(Object.create(proto), iface);
    const f = (instance as { f: (...a: unknown[]) => unknown }).f;

    f.call(instance, "text");
    f.call(instance, 12);

    expect(calls).toEqual(["string:text", "long:12"]);
  });

  test("converts the result through the selected overload's return type", () => {
    const iface = makeInterface({
      identifier: "Painter",
      members: {
        f: [
          makeOperation({
            identifier: "f",
            arguments: [{ type: makeDOMStringType(), identifier: "label" }],
            returnType: makeDOMStringType(),
            methodSteps: () => 12 as never,
          }),
          makeOperation({
            identifier: "f",
            arguments: [{ type: makeLongType(), identifier: "n" }],
            returnType: makeLongType(),
            methodSteps: () => "7" as never,
          }),
        ],
      },
    });
    const proto = prototypeOf(iface);
    const instance = associateInterface(Object.create(proto), iface);
    const f = (instance as { f: (...a: unknown[]) => unknown }).f;

    expect(f.call(instance, "text")).toBe("12");
    expect(f.call(instance, 5)).toBe(7);
  });

  test("the function's length is the shortest overload's argument count", () => {
    const iface = makeInterface({
      members: {
        f: [
          makeOperation({
            identifier: "f",
            argumentTypes: [makeDOMStringType(), makeDOMStringType()],
          }),
          makeOperation({ identifier: "f", argumentTypes: [makeLongType()] }),
        ],
      },
    });

    expect(methodOf(prototypeOf(iface), "f").length).toBe(1);
  });

  test("the property is skipped when every overload is unforgeable", () => {
    // Per [LegacyUnforgeable] the attribute must appear on all operations with
    // the same identifier, so the whole slot moves to the unforgeable pass.
    const unforgeable = (type: Type) =>
      makeOperation({
        identifier: "f",
        argumentTypes: [type],
        extendedAttributes: { [LegacyUnforgeable]: null },
      });
    const iface = makeInterface({
      members: {
        f: [unforgeable(makeLongType()), unforgeable(makeDOMStringType())],
      },
    });

    expect(Object.getOwnPropertyNames(prototypeOf(iface))).toEqual([]);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#LegacyUnforgeable
 *
 * The unforgeable members are the ones the regular passes leave out, and they
 * go on a separate target — in the binding, the object itself rather than the
 * prototype — as non-configurable properties. An overloaded identifier carries
 * the extended attribute on every one of its overloads, so the slot moves over
 * whole.
 */
describe("unforgeable members", () => {
  function unforgeableOf(iface: Interface): object {
    const target = {};
    defineUnforgeableRegularAttributes(iface, target);
    defineUnforgeableRegularOperations(iface, target);
    return target;
  }

  const unforgeable = (type: Type) =>
    makeOperation({
      identifier: "f",
      argumentTypes: [type],
      extendedAttributes: { [LegacyUnforgeable]: null },
    });

  test("an overloaded unforgeable operation is defined as one property", () => {
    const iface = makeInterface({
      members: {
        f: [unforgeable(makeLongType()), unforgeable(makeDOMStringType())],
      },
    });

    const target = unforgeableOf(iface);

    expect(Object.getOwnPropertyNames(target)).toEqual(["f"]);
    expect(Object.getOwnPropertyDescriptor(target, "f")).toMatchObject({
      writable: false,
      configurable: false,
      enumerable: true,
    });
  });

  test("an operation without the extended attribute is left to the prototype", () => {
    const iface = makeInterface({
      members: { f: [makeOperation({ identifier: "f" })] },
    });

    expect(Object.getOwnPropertyNames(unforgeableOf(iface))).toEqual([]);
    expect(Object.getOwnPropertyNames(prototypeOf(iface))).toEqual(["f"]);
  });

  test("an unforgeable attribute is defined as a non-configurable accessor", () => {
    const iface = makeInterface({
      members: {
        count: makeAttribute({
          type: makeLongType(),
          identifier: "count",
          getterSteps: readCount,
          extendedAttributes: { [LegacyUnforgeable]: null },
        }),
      },
    });

    const target = unforgeableOf(iface);

    expect(Object.getOwnPropertyNames(target)).toEqual(["count"]);
    expect(Object.getOwnPropertyDescriptor(target, "count")).toMatchObject({
      configurable: false,
      enumerable: true,
    });
    expect(Object.getOwnPropertyNames(prototypeOf(iface))).toEqual([]);
  });
});

/**
 * @see https://webidl.spec.whatwg.org/#idl-special-operations
 *
 * § 2.5.6: declaring a special operation with an identifier "is equivalent to
 * separating the special operation out into its own declaration without an
 * identifier". The operation that equivalence names is an ordinary member, so
 * it gets its property on the prototype like any other — the special behaviour
 * is what the interface's own field adds on top, not a replacement for it.
 */
describe("a special operation declared with an identifier", () => {
  const makeNamedGetter = () =>
    makeOperation({
      identifier: "item",
      keywords: ["getter"],
      argumentTypes: [makeUnsignedLongType()],
      returnType: makeDOMStringType(),
      methodSteps: (index: unknown) => `at ${String(index)}`,
    });

  test("gets its property on the prototype and can be invoked", () => {
    const getter = makeNamedGetter();
    const iface = makeInterface({
      identifier: "Collection",
      members: { item: [getter] },
      indexedPropertyGetter: getter as never,
    });
    const proto = prototypeOf(iface);
    const instance = associateInterface(Object.create(proto), iface);

    expect(Object.getOwnPropertyNames(proto)).toEqual(["item"]);
    expect(methodOf(proto, "item").call(instance, "2")).toBe("at 2");
  });

  test("is left off the prototype when it is declared without an identifier", () => {
    const iface = makeInterface({
      identifier: "Collection",
      indexedPropertyGetter: makeOperation({
        identifier: undefined,
        keywords: ["getter"],
        argumentTypes: [makeUnsignedLongType()],
      }) as never,
    });

    expect(Object.getOwnPropertyNames(prototypeOf(iface))).toEqual([]);
  });
});
