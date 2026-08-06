import type { Interface } from "@webidl";

import { defineAttributes } from "./define-the-attributes";
import { collectAttributes } from "./utils";

/** @see https://webidl.spec.whatwg.org/#define-the-static-attributes */
export function defineStaticAttributes(
  // TODO (namespace): a namespace or interface
  iface: Interface,
  target: object,
): void {
  const attributes = collectAttributes(iface.staticMembers);
  defineAttributes(attributes, iface, target);
}
