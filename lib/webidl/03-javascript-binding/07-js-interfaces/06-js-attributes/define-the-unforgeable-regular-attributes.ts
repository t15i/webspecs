import { isUnforgeable, type Interface } from "@webidl";

import { defineAttributes } from "./define-the-attributes";
import { collectAttributes } from "./utils";

/** @see https://webidl.spec.whatwg.org/#define-the-unforgeable-regular-attributes */
export function defineUnforgeableRegularAttributes(
  // TODO (namespace): a namespace or interface
  iface: Interface,
  target: object,
): void {
  const attributes = collectAttributes(iface.members, isUnforgeable);
  defineAttributes(attributes, iface, target);
}
