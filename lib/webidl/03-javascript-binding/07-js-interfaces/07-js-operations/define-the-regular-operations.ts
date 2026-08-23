import { isUnforgeable, type Interface, type Operation } from "@webidl";

import { defineOperations } from "./define-the-operations";
import { collectOperations } from "./utils";

// [LegacyUnforgeable] must appear on every operation with a given identifier if
// it appears on one, so the first overload answers for the whole slot.
const isNotUnforgeable = (overloads: Operation[]) =>
  !isUnforgeable(overloads[0]!);

/** @see https://webidl.spec.whatwg.org/#define-the-regular-operations */
export function defineRegularOperations(
  iface: Interface,
  target: object,
): void {
  const operations = collectOperations(iface.members, isNotUnforgeable);
  defineOperations(operations, iface, target);
}
