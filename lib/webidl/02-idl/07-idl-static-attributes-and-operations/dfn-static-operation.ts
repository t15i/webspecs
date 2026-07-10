import type { Operation } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-static-operation */
export function isStaticOperation(op: Operation): boolean {
  return op.keywords.has("static");
}
