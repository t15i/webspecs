import { isUnforgeable, type Attribute, type Interface } from "@webidl";

import { defineAttributes } from "./define-the-attributes";
import { collectAttributes } from "./utils";

const isNotUnforgeable = (attribute: Attribute) => !isUnforgeable(attribute);

/** @see https://webidl.spec.whatwg.org/#define-the-regular-attributes */
export function defineRegularAttributes(
  // TODO (namespace): a namespace or interface
  iface: Interface,
  target: object,
): void {
  const attributes = collectAttributes(iface.members, isNotUnforgeable);
  defineAttributes(attributes, iface, target);
}
