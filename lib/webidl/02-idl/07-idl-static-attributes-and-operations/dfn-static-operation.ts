import type { Operation } from "@webidl";

export function isStaticOperation(op: Operation): boolean {
  return op.keywords.has("static");
}
