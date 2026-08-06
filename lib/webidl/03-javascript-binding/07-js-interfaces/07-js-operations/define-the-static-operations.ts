import { type Interface } from "@webidl";

import { defineOperations } from "./define-the-operations";
import { collectOperations } from "./utils";

/** @see https://webidl.spec.whatwg.org/#define-the-static-operations */
export function defineStaticOperations(iface: Interface, target: object): void {
  const operations = collectOperations(iface.staticMembers);
  defineOperations(operations, iface, target);
}
