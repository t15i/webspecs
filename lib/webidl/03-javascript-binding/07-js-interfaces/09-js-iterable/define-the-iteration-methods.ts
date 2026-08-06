import { defineMethodProperty } from "@ecma";
import { interfaceHasIndexedPropertyGetter } from "@webidl";
import type { Interface } from "@webidl";

/**
 * Defines the iteration methods on the interface prototype object.
 *
 * @see https://webidl.spec.whatwg.org/#define-the-iteration-methods
 */
export function defineTheIterationMethods(
  iface: Interface,
  target: object,
): void {
  if (interfaceHasIndexedPropertyGetter(iface)) {
    defineMethodProperty(
      target,
      Symbol.iterator,
      Array.prototype.values,
      false,
    );
    // TODO (value iterator): "If definition has a value iterator..."
  }
  // TODO (pair iterator): "Otherwise, if definition has a pair iterator..."
}
