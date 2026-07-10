import { isStaticOperation } from "@webidl";
import type { Operation } from "@webidl";

export function isRegularOperation(op: Operation): boolean {
  return op.identifier !== undefined && !isStaticOperation(op);
}
