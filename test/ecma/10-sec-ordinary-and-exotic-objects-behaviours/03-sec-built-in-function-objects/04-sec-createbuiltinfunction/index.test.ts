/**
 * @see https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-createbuiltinfunction
 *
 * `createBuiltinFunction` realises a built-in function with a plain ECMAScript
 * function. A non-constructable function (attribute accessors, operations,
 * iteration methods) is a concise method: it has neither a `[[Construct]]`
 * internal method nor an own `prototype`, yet keeps a dynamic `this`. A
 * constructable function (an interface object) exposes `[[Construct]]` and lets
 * its steps observe `new.target`.
 */
import { describe, expect, test } from "vitest";
import { createBuiltinFunction } from "lib/ecma";

describe("createBuiltinFunction - non-constructable", () => {
  test("sets name and length", () => {
    const f = createBuiltinFunction(() => undefined, 2, "get foo", {
      construct: false,
    });
    expect(f.name).toBe("get foo");
    expect(f.length).toBe(2);
  });

  test("has no own prototype", () => {
    const f = createBuiltinFunction(() => undefined, 0, "op", {
      construct: false,
    });
    expect(Object.hasOwn(f, "prototype")).toBe(false);
  });

  test("forwards the dynamic this and arguments to the steps", () => {
    const f = createBuiltinFunction(
      function (this: unknown, a: unknown, b: unknown): unknown {
        return [this, a, b];
      },
      2,
      "op",
      { construct: false },
    );
    expect(Reflect.apply(f, { tag: "receiver" }, [1, 2])).toEqual([
      { tag: "receiver" },
      1,
      2,
    ]);
  });

  test("is not constructable", () => {
    const f = createBuiltinFunction(() => undefined, 0, "op", {
      construct: false,
    });
    expect(() => Reflect.construct(f, [])).toThrow(TypeError);
  });
});

describe("createBuiltinFunction - constructable", () => {
  test("sets name and length and has an own prototype", () => {
    const f = createBuiltinFunction(function () {}, 1, "Thing", {
      construct: true,
    });
    expect(f.name).toBe("Thing");
    expect(f.length).toBe(1);
    expect(Object.hasOwn(f, "prototype")).toBe(true);
  });

  test("lets the steps observe new.target and construct with it", () => {
    const f = createBuiltinFunction(
      function (this: unknown, ...args: unknown[]): unknown {
        if (new.target === undefined) throw new TypeError("requires new");
        return Reflect.construct(
          function Impl(this: { a: unknown }, a: unknown) {
            this.a = a;
          },
          args,
          new.target as CallableFunction,
        );
      },
      1,
      "Thing",
      { construct: true },
    );

    const instance = Reflect.construct(f, [7]) as { a: unknown };
    expect(instance.a).toBe(7);
    expect(instance).toBeInstanceOf(f);
  });

  test("throws when called without new", () => {
    const f = createBuiltinFunction(
      function (): unknown {
        if (new.target === undefined) throw new TypeError("requires new");
        return {};
      },
      0,
      "Thing",
      { construct: true },
    );
    expect(() => Reflect.apply(f, undefined, [])).toThrow(TypeError);
  });

  test("wraps a non-extensible behaviour so the result is fresh and works", () => {
    const behaviour = function (this: unknown, a: unknown): unknown {
      if (new.target === undefined) throw new TypeError("requires new");
      return Reflect.construct(
        function Impl(this: { a: unknown }, x: unknown) {
          this.a = x;
        },
        [a],
        new.target as CallableFunction,
      );
    };
    Object.preventExtensions(behaviour);

    // A non-default proto forces a real Object.setPrototypeOf, which would throw
    // on a non-extensible object — proving the result is a fresh wrapper.
    const f = createBuiltinFunction(behaviour, 1, "Thing", {
      construct: true,
      proto: Array.prototype,
    });

    expect(Object.isExtensible(f)).toBe(true);
    expect(Object.getPrototypeOf(f)).toBe(Array.prototype);

    const instance = Reflect.construct(f, [7]) as { a: unknown };
    expect(instance.a).toBe(7);
    expect(instance).toBeInstanceOf(f);
  });
});

describe("createBuiltinFunction - proto", () => {
  test("defaults [[Prototype]] to Function.prototype", () => {
    const f = createBuiltinFunction(() => undefined, 0, "op", {
      construct: false,
    });
    expect(Object.getPrototypeOf(f)).toBe(Function.prototype);
  });

  test("uses the supplied proto", () => {
    const parent = function Parent(): void {};
    const f = createBuiltinFunction(function Child(): void {}, 0, "Child", {
      construct: true,
      proto: parent,
    });
    expect(Object.getPrototypeOf(f)).toBe(parent);
  });

  test("accepts a null proto", () => {
    const f = createBuiltinFunction(() => undefined, 0, "op", {
      construct: false,
      proto: null,
    });
    expect(Object.getPrototypeOf(f)).toBe(null);
  });
});

describe("createBuiltinFunction - prefix", () => {
  test("prepends prefix to the name separated by a space", () => {
    const f = createBuiltinFunction(() => undefined, 0, "size", {
      construct: false,
      prefix: "get",
    });
    expect(f.name).toBe("get size");
  });
});
