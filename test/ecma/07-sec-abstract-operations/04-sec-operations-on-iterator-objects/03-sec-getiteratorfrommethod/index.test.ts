/**
 * @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getiteratorfrommethod
 *
 * GetIteratorFromMethod ( obj, method ) calls the method with obj as the this
 * value, requires what comes back to be an object, and hands it to
 * GetIteratorDirect for the record. The method is given rather than looked up,
 * so an iterator getter is called exactly where the caller decided to.
 */
import { describe, expect, test } from "vitest";
import { getIteratorFromMethod } from "lib/ecma";

describe("getIteratorFromMethod", () => {
  test("calls the method with the object as the this value", () => {
    const seen: unknown[] = [];
    const obj = { marker: 1 };

    getIteratorFromMethod(obj, function (this: unknown) {
      seen.push(this);
      return { next: () => ({ done: true, value: undefined }) };
    });

    expect(seen).toEqual([obj]);
  });

  test("returns the record GetIteratorDirect makes of the iterator", () => {
    const next = () => ({ done: true, value: undefined });
    const iterator = { next };

    expect(getIteratorFromMethod({}, () => iterator)).toEqual({
      iterator,
      nextMethod: next,
      done: false,
    });
  });

  test("throws when the method does not return an object", () => {
    expect(() => getIteratorFromMethod({}, () => 1)).toThrow(TypeError);
  });

  test("propagates a throw from the method", () => {
    expect(() =>
      getIteratorFromMethod({}, () => {
        throw new RangeError("nope");
      }),
    ).toThrow(RangeError);
  });
});
