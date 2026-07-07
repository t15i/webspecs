import { getMethod, isObject } from "@ecma";
import { ordinaryToPrimitive } from "./01-sec-ordinarytoprimitive";

/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toprimitive */
export function toPrimitive(
  input: unknown,
  preferredType?: "string" | "number",
): unknown {
  if (isObject(input)) {
    const exoticToPrimitive = getMethod(input, Symbol.toPrimitive);
    if (exoticToPrimitive !== undefined) {
      let hint: "default" | "string" | "number";
      if (preferredType === undefined) {
        hint = "default";
      } else if (preferredType === "string") {
        hint = "string";
      } else {
        hint = "number";
      }
      const result = (
        exoticToPrimitive as (this: object, hint: string) => unknown
      ).call(input, hint);
      if (!isObject(result)) {
        return result;
      }
      throw TypeError("Cannot convert object to primitive value");
    }
    return ordinaryToPrimitive(input, preferredType ?? "number");
  }
  return input;
}

export * from "./01-sec-ordinarytoprimitive";
