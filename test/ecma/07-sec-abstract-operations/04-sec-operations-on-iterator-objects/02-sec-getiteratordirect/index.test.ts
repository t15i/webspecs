/**
 * @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getiteratordirect
 *
 * GetIteratorDirect ( obj ) reads obj's "next" and returns an Iterator Record
 * whose iterator is obj, whose next method is what was read, and which is not
 * done. The read happens the once, here, rather than on every step taken with
 * the record.
 */
import { describe, expect, test } from "vitest";
import { getIteratorDirect } from "lib/ecma";

describe("getIteratorDirect", () => {
  test("returns the object and its next method, not done", () => {
    const next = () => ({ done: true, value: undefined });
    const obj = { next };

    expect(getIteratorDirect(obj)).toEqual({
      iterator: obj,
      nextMethod: next,
      done: false,
    });
  });

  test("reads next once", () => {
    let reads = 0;
    const obj = {
      get next() {
        reads += 1;
        return () => ({ done: true, value: undefined });
      },
    };

    getIteratorDirect(obj);

    expect(reads).toBe(1);
  });

  test("keeps whatever next held, callable or not", () => {
    // The field is an ECMAScript language value: reading it settles nothing
    // about it, and calling it is what would report a next that is no method.
    expect(getIteratorDirect({ next: 1 }).nextMethod).toBe(1);
    expect(getIteratorDirect({}).nextMethod).toBeUndefined();
  });

  test("propagates a throw from the next getter", () => {
    const obj = {
      get next(): never {
        throw new RangeError("nope");
      },
    };

    expect(() => getIteratorDirect(obj)).toThrow(RangeError);
  });
});
