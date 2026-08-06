import { definePropertyOrThrow } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-setfunctionlength */
export function setFunctionLength(
  func: CallableFunction,
  length: number,
): void {
  definePropertyOrThrow(func, "length", {
    value: length,
    writable: false,
    enumerable: false,
    configurable: true,
  });
}
