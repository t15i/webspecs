import { isUnforgeable, type Interface, type Member } from "@webidl";

import { defineOperations } from "./define-the-operations";
import { collectOperations } from "./utils";

const isNotUnforgeable = (member: Member) => !isUnforgeable(member);

/** @see https://webidl.spec.whatwg.org/#define-the-regular-operations */
export function defineRegularOperations(
  iface: Interface,
  target: object,
): void {
  const operations = collectOperations(iface.members, isNotUnforgeable);
  defineOperations(operations, iface, target);
}
