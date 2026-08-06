import { definePropertyOrThrow } from "@ecma";
import type { PropertyKey } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-setfunctionname */
export function setFunctionName(
  func: CallableFunction,
  name: PropertyKey,
  prefix?: string,
): void {
  let resolvedName: string;
  if (typeof name === "symbol") {
    const description = name.description;
    if (description === undefined) {
      resolvedName = "";
    } else {
      resolvedName = "[" + description + "]";
    }
  } else {
    // NOTE (PrivateName): the spec's "name is a Private Name" branch is
    // unreachable - the JS runtime has no Private Names, so name is a String.
    resolvedName = name;
  }

  // NOTE (InitialName): "If func has an [[InitialName]] internal slot..." cannot be
  // implemented in JS runtime

  if (prefix !== undefined) {
    resolvedName = prefix + " " + resolvedName;
    // NOTE (InitialName): "If func has an [[InitialName]] internal slot..." cannot
    // be implemented in JS runtime
  }

  definePropertyOrThrow(func, "name", {
    value: resolvedName,
    writable: false,
    enumerable: false,
    configurable: true,
  });
}
