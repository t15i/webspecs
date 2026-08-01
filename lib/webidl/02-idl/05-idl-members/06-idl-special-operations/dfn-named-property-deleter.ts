import {
  ExistingNamedPropertyDeleter,
  NamedPropertyGetter,
  interfaceExtraValidationRules,
  isDOMStringType,
  type Operation,
} from "@webidl";
import type { NamedPropertyDeleterOperation } from "./02-idl-named-properties";

/** @see https://webidl.spec.whatwg.org/#dfn-named-property-deleter */
export const NamedPropertyDeleter: unique symbol = Symbol(
  "NamedPropertyDeleter",
);

declare module "@webidl" {
  interface InterfaceMembers {
    [NamedPropertyDeleter]?: NamedPropertyDeleterOperation;
  }
}

/**
 * Argument-shape validation for a named property deleter: it must take a single
 * "DOMString" argument.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-named-property-deleter
 */
export function validateNamedPropertyDeleter(op: Operation): void {
  if (op.arguments.length !== 1 || !isDOMStringType(op.arguments[0]!.type)) {
    throw TypeError(
      `A named property deleter must take a single "DOMString" argument.`,
    );
  }
}

/** @see https://webidl.spec.whatwg.org/#idl-special-operations */
interfaceExtraValidationRules.push((iface) => {
  // § 2.5.6: "If it has a named property deleter, then it must also have a named
  // property getter."
  if (
    NamedPropertyDeleter in iface.members &&
    !(NamedPropertyGetter in iface.members)
  ) {
    throw TypeError(
      "An interface with a named property deleter must also have a named property getter.",
    );
  }

  // § 2.5.6.2: deleting a named property is performed by invoking the deleter.
  // When the deleter is declared without an identifier the interface must instead
  // supply the anonymous steps to delete an existing named property; a named
  // deleter deletes through its own steps.
  const deleter = iface.members[NamedPropertyDeleter];
  if (
    deleter !== undefined &&
    deleter.identifier === undefined &&
    !(ExistingNamedPropertyDeleter in iface.members)
  ) {
    throw TypeError(
      "An interface with an unnamed named property deleter must define the steps to delete an existing named property.",
    );
  }
});
