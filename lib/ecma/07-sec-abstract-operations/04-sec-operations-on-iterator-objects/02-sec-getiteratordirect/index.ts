import type { IteratorRecord } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getiteratordirect */
export function getIteratorDirect(obj: object): IteratorRecord {
  const nextMethod: unknown = (obj as Record<PropertyKey, unknown>)["next"];

  const iteratorRecord: IteratorRecord = {
    iterator: obj,
    nextMethod,
    done: false,
  };

  return iteratorRecord;
}
