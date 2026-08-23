import type { Argument } from "./dfn-operation";

/** @see https://webidl.spec.whatwg.org/#dfn-optional-argument */
export function isOptionalArgument(argument: Argument): boolean {
  return argument.keywords.has("optional");
}
