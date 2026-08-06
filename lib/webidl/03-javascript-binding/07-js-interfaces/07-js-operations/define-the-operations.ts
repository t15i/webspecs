import { definePropertyOrThrow } from "@ecma";
import { isUnforgeable, type Interface, type Operation } from "@webidl";

import { createOperationFunction } from "./create-operation-function";

/**
 * Defines a list of operations on a target object as data properties.
 *
 * @see https://webidl.spec.whatwg.org/#define-the-operations
 */
export function defineOperations(
  operations: Operation[],
  iface: Interface,
  target: object,
): void {
  for (const op of operations) {
    // NOTE (realm): "If attr is not exposed in realm..." is always false

    const method = createOperationFunction(op, iface);
    const modifiable = !isUnforgeable(op);

    // The operations reaching this point are regular/static operations, which by
    // definition carry an identifier (collectOperations filters out any without
    // one), so the property key is always a defined identifier.
    definePropertyOrThrow(target, op.identifier!, {
      value: method,
      writable: modifiable,
      enumerable: true,
      configurable: modifiable,
    });
  }
}
