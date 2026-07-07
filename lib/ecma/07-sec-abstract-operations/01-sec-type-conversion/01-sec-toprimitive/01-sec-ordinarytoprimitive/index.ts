import { isCallable, isObject } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-ordinarytoprimitive */
export function ordinaryToPrimitive(
  O: object,
  hint: "string" | "number",
): unknown {
  const methodNames =
    hint === "string" ? ["toString", "valueOf"] : ["valueOf", "toString"];
  for (const name of methodNames) {
    const method = (O as Record<string, unknown>)[name];
    if (isCallable(method)) {
      const result = (method as (this: object) => unknown).call(O);
      if (!isObject(result)) {
        return result;
      }
    }
  }
  throw TypeError("Cannot convert object to primitive value");
}
