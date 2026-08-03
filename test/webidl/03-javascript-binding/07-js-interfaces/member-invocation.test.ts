/**
 * @see https://webidl.spec.whatwg.org/#dfn-attribute-getter
 * @see https://webidl.spec.whatwg.org/#dfn-attribute-setter
 * @see https://webidl.spec.whatwg.org/#dfn-create-operation-function
 *
 * Runtime behaviour of the accessor and operation functions installed on the
 * interface prototype object: a regular member checks that `this` implements
 * the interface (throwing "Illegal invocation" otherwise), converts JS values
 * to IDL values on the way in, and forwards `this` to the member's steps. A
 * member whose type/return is a promise turns a synchronous throw into a
 * rejected promise.
 */
import { describe, expect, test } from "vitest";
import { getInterfacePrototypeObject } from "lib/webidl";

import { makeInterface } from "./utils";
import {
  makeAttribute,
  makeOperation,
} from "../../02-idl/05-idl-members/utils";
import {
  associateInterface,
  makeLongType,
  makePromiseType,
} from "../../02-idl/13-idl-types/utils";

const store = new WeakMap<object, number>();

function readCount(this: object): number {
  return store.get(this) ?? -1;
}

function writeCount(this: object, value: number): void {
  store.set(this, value);
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
    const proto = getInterfacePrototypeObject(iface);
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
    const proto = getInterfacePrototypeObject(iface);
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
    const getter = getterOf(getInterfacePrototypeObject(iface), "count");

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
    const setter = setterOf(getInterfacePrototypeObject(iface), "count");

    expect(() => setter.call({}, 1)).toThrow(TypeError);
  });
});

describe("regular operations", () => {
  test("converts arguments to IDL and invokes the method steps on this", () => {
    const calls: Array<{ self: unknown; arg: unknown }> = [];
    const iface = makeInterface({
      members: {
        add: makeOperation({
          identifier: "add",
          argumentTypes: [makeLongType()],
          methodSteps(this: unknown, n: unknown) {
            calls.push({ self: this, arg: n });
            return n;
          },
        }),
      },
    });
    const proto = getInterfacePrototypeObject(iface);
    const instance = associateInterface(Object.create(proto), iface);

    const result = (instance as { add: (n: unknown) => unknown }).add("4");

    expect(result).toBe(4);
    expect(calls).toEqual([{ self: instance, arg: 4 }]);
  });

  test("throws Illegal invocation for a foreign this", () => {
    const iface = makeInterface({
      members: {
        add: makeOperation({
          identifier: "add",
          argumentTypes: [makeLongType()],
          methodSteps: () => undefined,
        }),
      },
    });
    const method = methodOf(getInterfacePrototypeObject(iface), "add");

    expect(() => method.call({}, 1)).toThrow(TypeError);
  });
});

describe("promise-typed members reject rather than throw", () => {
  test("a promise-typed operation returns a rejected promise on illegal invocation", async () => {
    const iface = makeInterface({
      members: {
        load: makeOperation({
          identifier: "load",
          returnType: makePromiseType(makeLongType()),
          methodSteps: () => Promise.resolve(1),
        }),
      },
    });
    const method = methodOf(getInterfacePrototypeObject(iface), "load");

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
    const getter = getterOf(getInterfacePrototypeObject(iface), "ready");

    await expect(getter.call({}) as Promise<unknown>).rejects.toThrow(
      TypeError,
    );
  });
});
