import { isUnforgeable, type Interface } from "@webidl";

import { defineOperations } from "./define-the-operations";
import { collectOperations } from "./utils";

/** @see https://webidl.spec.whatwg.org/#define-the-operations */
export function defineUnforgeableRegularOperations(
  iface: Interface,
  target: object,
): void {
  const operations = collectOperations(iface.members, isUnforgeable);
  defineOperations(operations, iface, target);
}
