import { isStaticOperation } from "@webidl";
import type { Operation } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-regular-operation */
export function isRegularOperation(op: Operation): boolean {
  return op.identifier !== undefined && !isStaticOperation(op);
}
