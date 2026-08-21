import { isUnforgeable, type Interface, type Operation } from "@webidl";

import { defineOperations } from "./define-the-operations";
import { collectOperations } from "./utils";

// [LegacyUnforgeable] must appear on every operation with a given identifier if
// it appears on one, so the first overload answers for the whole slot.
const isOverloadUnforgeable = (overloads: Operation[]) =>
  isUnforgeable(overloads[0]!);

/** @see https://webidl.spec.whatwg.org/#define-the-operations */
export function defineUnforgeableRegularOperations(
  iface: Interface,
  target: object,
): void {
  const operations = collectOperations(iface.members, isOverloadUnforgeable);
  defineOperations(operations, iface, target);
}
