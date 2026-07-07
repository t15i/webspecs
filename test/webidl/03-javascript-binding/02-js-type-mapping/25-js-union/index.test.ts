/**
 * @see https://webidl.spec.whatwg.org/#js-union
 *
 * Spec algorithm (top-level steps relevant to this library - buffer
 * source / TypedArray / DataView cases are explicitly out of scope and
 * are skipped, as is the [[StringData]] internal slot branch for the
 * async sequence case):
 *
 *   1. If the union type includes undefined and V is undefined, return
 *      the unique undefined value.
 *   2. If the union type includes a nullable type and V is null or
 *      undefined, return the IDL value null.
 *   3. Let types be the flattened member types of the union type.
 *   4. If V is null or undefined:
 *      1. If types includes a dictionary type, then return the result
 *         of converting V to that dictionary type.
 *   5. If V is a platform object:
 *      1. If types includes an interface type that V implements,
 *         return V.
 *      2. If types includes object, return V.
 *   10. If IsCallable(V):
 *       1. If types includes a callback function type, then return the
 *          result of converting V to that callback function type.
 *       2. If types includes object, return V.
 *   11. If V is an Object:
 *       1. If types includes an async sequence type, then (subject to
 *          the [[StringData]] guard): if V has Symbol.asyncIterator or
 *          Symbol.iterator, return V.
 *       2. If types includes a sequence type, then if V has
 *          Symbol.iterator, return the sequence.
 *       3. If types includes a frozen array type, then if V has
 *          Symbol.iterator, return the frozen array.
 *       4. If types includes a dictionary type, convert.
 *       5. If types includes a record type, convert.
 *       6. If types includes a callback interface type, convert.
 *       7. If types includes object, return V.
 *   12. If V is a Boolean and types includes boolean, convert.
 *   13. If V is a Number and types includes a numeric type, convert.
 *   14. If V is a BigInt and types includes bigint, convert.
 *   15. If types includes a string type, convert V to that type.
 *   16. If types includes a numeric type and bigint:
 *       - if V is a BigInt: convert to bigint
 *       - otherwise: convert to numeric
 *   17. If types includes a numeric type, convert.
 *   18. If types includes boolean, convert.
 *   19. If types includes bigint, convert.
 *   20. Throw a TypeError.
 */
import { describe, expect, test } from "vitest";

import {
  makeAsyncSequenceType,
  makeBigIntType,
  makeBooleanType,
  makeCallbackFunctionType,
  makeCallbackInterfaceType,
  makeDictionaryType,
  makeDOMStringType,
  makeDoubleType,
  makeFrozenArrayType,
  makeInterfaceType,
  makeLongType,
  makeNullableType,
  makeObjectType,
  makePlatformObject,
  makeRecordType,
  makeSequenceType,
  makeUndefinedType,
  makeUnionType,
  makeUSVStringType,
} from "../../../02-idl/13-idl-types/utils";

describe("asUnion - step 1: includes undefined and V is undefined", () => {
  test("(undefined or DOMString), V=undefined -> undefined", () => {
    const T = makeUnionType([makeUndefinedType(), makeDOMStringType()]);
    expect(T(undefined)).toBe(undefined);
  });
});

describe("asUnion - step 2: includes a nullable type and V is null/undefined", () => {
  test("(DOMString? or long), V=null -> null", () => {
    const T = makeUnionType([
      makeNullableType(makeDOMStringType()),
      makeLongType(),
    ]);
    expect(T(null)).toBe(null);
  });

  test("(DOMString? or long), V=undefined -> null", () => {
    const T = makeUnionType([
      makeNullableType(makeDOMStringType()),
      makeLongType(),
    ]);
    expect(T(undefined)).toBe(null);
  });
});

describe("asUnion - step 4: dictionary fallback for null/undefined", () => {
  test("(Dictionary or DOMString), V=null -> dictionary({})", () => {
    const dict = makeDictionaryType<string>((v) => ({ raw: String(v) }));
    const T = makeUnionType([dict, makeDOMStringType()]);
    expect(T(null)).toEqual({ raw: "null" });
  });

  test("(Dictionary or DOMString), V=undefined -> dictionary", () => {
    const dict = makeDictionaryType<string>((v) => ({ raw: String(v) }));
    const T = makeUnionType([dict, makeDOMStringType()]);
    expect(T(undefined)).toEqual({ raw: "undefined" });
  });
});

describe("asUnion - step 5: platform object / interface matching", () => {
  // The current library identifies platform objects via
  // PlatformObject.getPrimaryInterfaceOf. When it returns null the
  // implementation falls through to the IsCallable / Object branches, but the spec
  // still requires interface matching to succeed when V is an
  // instance of one of the union's interface types. We test the
  // canonical instanceof case via the Object branch (step 11.7) since
  // there is no public surface to mark an instance as a platform
  // object from a test.
  test("(Interface or object), V is an instance of the interface -> V", () => {
    class Foo {}
    const I = makeInterfaceType(Foo);
    const T = makeUnionType([I, makeObjectType()]);
    const v = new Foo();
    expect(T(v)).toBe(v);
  });
});

describe("asUnion - step 10: IsCallable(V) -> callback function", () => {
  test("(object), V=fn -> V (functions are objects per spec)", () => {
    const T = makeUnionType([makeObjectType()]);
    const fn = (): number => 1;
    expect(T(fn)).toBe(fn);
  });
});

describe("asUnion - step 11: Object branch", () => {
  test("(Sequence<long> or object), V=[1,2,3] -> sequence [1,2,3]", () => {
    const T = makeUnionType([
      makeSequenceType(makeLongType()),
      makeObjectType(),
    ]);
    expect(T([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test("(FrozenArray<long> or object), V=[1,2,3] -> frozen array", () => {
    const T = makeUnionType([
      makeFrozenArrayType(makeLongType()),
      makeObjectType(),
    ]);
    const out = T([1, 2, 3]);
    expect(out).toEqual([1, 2, 3]);
    expect(Object.isFrozen(out)).toBe(true);
  });

  test("(AsyncSequence or DOMString), V is object with Symbol.asyncIterator -> V", () => {
    const T = makeUnionType([
      makeAsyncSequenceType(makeLongType()),
      makeDOMStringType(),
    ]);
    const v = {
      [Symbol.asyncIterator](): AsyncIterator<number> {
        let i = 0;
        return {
          next(): Promise<IteratorResult<number>> {
            return Promise.resolve(
              i < 1
                ? { value: i++, done: false }
                : { value: undefined as never, done: true },
            );
          },
        };
      },
    };
    expect(T(v)).toBe(v);
  });

  test("(Dictionary or object), V={} -> dictionary", () => {
    const dict = makeDictionaryType<string>(() => ({ ok: "yes" }));
    const T = makeUnionType([dict, makeObjectType()]);
    expect(T({})).toEqual({ ok: "yes" });
  });

  test("(Record or object), V={a:1} -> record", () => {
    const T = makeUnionType([
      makeRecordType(makeDOMStringType(), makeDoubleType()),
      makeObjectType(),
    ]);
    expect(T({ a: 1 })).toEqual({ a: 1 });
  });

  test("(object only), V={} -> V", () => {
    const T = makeUnionType([makeObjectType()]);
    const v = { x: 1 };
    expect(T(v)).toBe(v);
  });
});

describe("asUnion - step 12: Boolean", () => {
  test("(boolean or DOMString), V=true -> true", () => {
    const T = makeUnionType([makeBooleanType(), makeDOMStringType()]);
    expect(T(true)).toBe(true);
  });
});

describe("asUnion - step 13: Number (numeric)", () => {
  test("(long or DOMString), V=42 -> 42", () => {
    const T = makeUnionType([makeLongType(), makeDOMStringType()]);
    expect(T(42)).toBe(42);
  });

  test("(double or DOMString), V=3.14 -> 3.14", () => {
    const T = makeUnionType([makeDoubleType(), makeDOMStringType()]);
    expect(T(3.14)).toBe(3.14);
  });
});

describe("asUnion - step 14: BigInt", () => {
  test("(bigint or DOMString), V=1n -> 1n", () => {
    const T = makeUnionType([makeBigIntType(), makeDOMStringType()]);
    expect(T(1n)).toBe(1n);
  });
});

describe("asUnion - step 15: includes a string type -> convert to string", () => {
  test("(DOMString or long), V='abc' -> 'abc'", () => {
    const T = makeUnionType([makeDOMStringType(), makeLongType()]);
    expect(T("abc")).toBe("abc");
  });

  test("(USVString or long), V='abc' -> 'abc'", () => {
    const T = makeUnionType([makeUSVStringType(), makeLongType()]);
    expect(T("abc")).toBe("abc");
  });

  test("(DOMString or long), V=Symbol() falls through to string conversion which throws", () => {
    // Per spec, step 15 converts V to the string type, and ToString
    // of a Symbol throws TypeError.
    const T = makeUnionType([makeDOMStringType(), makeLongType()]);
    expect(() => T(Symbol("x"))).toThrow(TypeError);
  });
});

describe("asUnion - step 16: numeric + bigint", () => {
  test("(long or bigint), V=42 -> 42 (numeric branch)", () => {
    const T = makeUnionType([makeLongType(), makeBigIntType()]);
    expect(T(42)).toBe(42);
  });

  test("(long or bigint), V=1n -> 1n (bigint branch)", () => {
    const T = makeUnionType([makeLongType(), makeBigIntType()]);
    expect(T(1n)).toBe(1n);
  });
});

describe("asUnion - step 18: boolean fallback", () => {
  test("(boolean), V='x' -> true (boolean fallback for non-string V types)", () => {
    // V is a string; types include boolean but no string type. Step 15
    // doesn't fire; step 18 converts V to boolean.
    const T = makeUnionType([makeBooleanType()]);
    expect(T("x")).toBe(true);
  });
});

describe("asUnion - step 20: nothing matches -> TypeError", () => {
  test("(long), V is a string with no string member -> numeric fallback", () => {
    // Step 17 fires: include numeric, convert. "abc" -> NaN -> 0.
    const T = makeUnionType([makeLongType()]);
    expect(T("abc")).toBe(0);
  });

  test("(bigint), V is undefined and no nullable/undefined member -> bigint fallback -> TypeError", () => {
    // Step 19 fires, ToBigInt(undefined) throws TypeError.
    const T = makeUnionType([makeBigIntType()]);
    expect(() => T(undefined)).toThrow(TypeError);
  });
});

describe("asUnion - step 5.2: V is a platform object, types includes object -> V", () => {
  test("(object), V is a platform object -> V", () => {
    const v = makePlatformObject("test");
    const T = makeUnionType([makeObjectType()]);
    expect(T(v)).toBe(v);
  });
});

describe("asUnion - step 5.1: V is a platform object, types includes an interface type V implements -> V", () => {
  test("(Interface) only, V is an instance -> V (isolated from the object branch)", () => {
    class HTMLElement {}
    const T = makeUnionType([makeInterfaceType(HTMLElement)]);
    const v = new HTMLElement();
    expect(T(v)).toBe(v);
  });

  test("(Interface) only, V is NOT an instance -> TypeError", () => {
    class HTMLElement {}
    const T = makeUnionType([makeInterfaceType(HTMLElement)]);
    expect(() => T({})).toThrow(TypeError);
  });
});

describe("asUnion - step 9.1: IsCallable(V), types includes a callback function type", () => {
  test("(CallbackFunction), V is a function -> converted callback (V)", () => {
    const T = makeUnionType([makeCallbackFunctionType()]);
    const fn = (): number => 1;
    expect(T(fn)).toBe(fn);
  });
});

describe("asUnion - step 10.1: async sequence via a sync iterator", () => {
  test("(AsyncSequence), V has Symbol.iterator but not Symbol.asyncIterator -> V", () => {
    const T = makeUnionType([makeAsyncSequenceType(makeLongType())]);
    const v = {
      *[Symbol.iterator](): Iterator<number> {
        yield 1;
      },
    };
    expect(T(v)).toBe(v);
  });
});

describe("asUnion - step 10.6: types includes a callback interface type", () => {
  test("(CallbackInterface), V is a plain object -> converted (V)", () => {
    const T = makeUnionType([makeCallbackInterfaceType()]);
    const v = { any: "object" };
    expect(T(v)).toBe(v);
  });
});

describe("asUnion - numeric type and bigint (converted to a numeric type or bigint)", () => {
  // Spec: let x = ToNumeric(V); if x is a BigInt -> bigint, else -> numeric.
  // The decision is made on ToNumeric(V), i.e. on the *coerced* value.

  test("(long or bigint), V is a plain string '5' -> numeric 5", () => {
    // ToNumeric("5") is the Number 5 -> numeric branch.
    const T = makeUnionType([makeLongType(), makeBigIntType()]);
    expect(T("5")).toBe(5);
  });

  test("(long or bigint), V is an object whose primitive is a Number -> numeric", () => {
    // ToNumeric({valueOf:()=>7}) is the Number 7 -> numeric branch.
    const T = makeUnionType([makeLongType(), makeBigIntType()]);
    expect(T({ valueOf: () => 7 })).toBe(7);
  });

  test("(long or bigint), V is an object whose primitive is a BigInt -> bigint", () => {
    // ToNumeric of an object whose [Symbol.toPrimitive] returns a BigInt is
    // that BigInt, so the spec routes this to the bigint conversion.
    const T = makeUnionType([makeLongType(), makeBigIntType()]);
    const v = {
      [Symbol.toPrimitive]: () => 10n,
    };
    expect(T(v)).toBe(10n);
  });
});

describe("asUnion - final step: nothing matches -> TypeError", () => {
  test("(sequence<long>), V is a non-iterable number -> TypeError", () => {
    const T = makeUnionType([makeSequenceType(makeLongType())]);
    expect(() => T(42)).toThrow(TypeError);
  });
});

describe("asUnion - a member type does not match, falls through to the next rule", () => {
  test("IsCallable(V), no callback function type nor object -> treated as Object (callback interface)", () => {
    // Step 9 yields nothing (no callback function type, no object); a function
    // is an Object, so step 10 applies and it converts to the callback interface.
    const T = makeUnionType([makeCallbackInterfaceType()]);
    const fn = (): void => {};
    expect(T(fn)).toBe(fn);
  });

  test("(AsyncSequence or DOMString), V is a String object -> converted to string, not async sequence", () => {
    // The async-sequence step is skipped when types includes a string type and
    // V has a [[StringData]] internal slot; V is then converted to the string.
    const T = makeUnionType([
      makeAsyncSequenceType(makeLongType()),
      makeDOMStringType(),
    ]);
    expect(T(new String("hi"))).toBe("hi");
  });

  test("(AsyncSequence or object), V is a non-iterable object -> object branch", () => {
    const T = makeUnionType([
      makeAsyncSequenceType(makeLongType()),
      makeObjectType(),
    ]);
    const v = { plain: true };
    expect(T(v)).toBe(v);
  });

  test("(sequence<long> or object), V is a non-iterable object -> object branch", () => {
    const T = makeUnionType([
      makeSequenceType(makeLongType()),
      makeObjectType(),
    ]);
    const v = { plain: true };
    expect(T(v)).toBe(v);
  });

  test("(FrozenArray<long> or object), V is a non-iterable object -> object branch", () => {
    const T = makeUnionType([
      makeFrozenArrayType(makeLongType()),
      makeObjectType(),
    ]);
    const v = { plain: true };
    expect(T(v)).toBe(v);
  });

  test("(long), V is a Boolean but no boolean type -> numeric conversion", () => {
    // Step 11 (Boolean) yields nothing; the numeric fallback converts true -> 1.
    const T = makeUnionType([makeLongType()]);
    expect(T(true)).toBe(1);
  });

  test("(DOMString), V is a BigInt but no bigint type -> string conversion", () => {
    // Step for BigInt yields nothing; the string type converts 5n -> "5".
    const T = makeUnionType([makeDOMStringType()]);
    expect(T(5n)).toBe("5");
  });
});
