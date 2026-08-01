import {
  ExistingIndexedPropertySetter,
  IndexedPropertyGetter,
  NewIndexedPropertySetter,
  interfaceExtraValidationRules,
  isUnsignedLongType,
  type Operation,
} from "@webidl";
import type { IndexedPropertySetterOperation } from "./01-idl-indexed-properties";

/** @see https://webidl.spec.whatwg.org/#dfn-indexed-property-setter */
export const IndexedPropertySetter: unique symbol = Symbol(
  "IndexedPropertySetter",
);

declare module "@webidl" {
  interface InterfaceMembers {
    [IndexedPropertySetter]?: IndexedPropertySetterOperation;
  }
}

/**
 * Argument-shape validation for an indexed property setter: it must take an
 * "unsigned long" argument followed by a value argument.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-indexed-property-setter
 */
export function validateIndexedPropertySetter(op: Operation): void {
  if (op.arguments.length !== 2 || !isUnsignedLongType(op.arguments[0]!.type)) {
    throw TypeError(
      `An indexed property setter must take an "unsigned long" argument followed by a value argument.`,
    );
  }
}

interfaceExtraValidationRules.push((iface) => {
  // § 2.5.6: "If an interface has a setter of a given variety, then it must also
  // have a getter of that variety."
  // https://webidl.spec.whatwg.org/#idl-special-operations
  if (
    IndexedPropertySetter in iface.members &&
    !(IndexedPropertyGetter in iface.members)
  ) {
    throw TypeError(
      "An interface with an indexed property setter must also have an indexed property getter.",
    );
  }

  // § 2.5.6.1: setting an indexed property is performed by invoking the setter.
  // When the setter is declared without an identifier the interface must instead
  // supply the anonymous steps to set the value of both new and existing indexed
  // properties; a named setter sets the value through its own steps.
  // https://webidl.spec.whatwg.org/#dfn-set-the-value-of-a-new-indexed-property
  // https://webidl.spec.whatwg.org/#dfn-set-the-value-of-an-existing-indexed-property
  const setter = iface.members[IndexedPropertySetter];
  if (
    setter !== undefined &&
    setter.identifier === undefined &&
    (!(NewIndexedPropertySetter in iface.members) ||
      !(ExistingIndexedPropertySetter in iface.members))
  ) {
    throw TypeError(
      "An interface with an unnamed indexed property setter must define the steps to set the value of both new and existing indexed properties.",
    );
  }
});
