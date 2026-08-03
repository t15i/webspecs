import { isUnforgeable, type Interface, type Member } from "@webidl";

import { defineAttributes } from "./define-the-attributes";
import { collectAttributes } from "./utils";

const isNotUnforgeable = (member: Member) => !isUnforgeable(member);

/** @see https://webidl.spec.whatwg.org/#define-the-regular-attributes */
export function defineRegularAttributes(
  // TODO (namespace): a namespace or interface
  iface: Interface,
  target: object,
): void {
  const attributes = collectAttributes(iface.members, isNotUnforgeable);
  defineAttributes(attributes, iface, target);
}
