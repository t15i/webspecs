import {
  ExistingNamedPropertySetter,
  NamedPropertyGetter,
  NewNamedPropertySetter,
  interfaceExtraValidationRules,
  isDOMStringType,
  type Operation,
} from "@webidl";
import type { NamedPropertySetterOperation } from "./02-idl-named-properties";

/** @see https://webidl.spec.whatwg.org/#dfn-named-property-setter */
export const NamedPropertySetter: unique symbol = Symbol("NamedPropertySetter");

declare module "@webidl" {
  interface InterfaceMembers {
    [NamedPropertySetter]?: NamedPropertySetterOperation;
  }
}

/**
 * Argument-shape validation for a named property setter: it must take a
 * "DOMString" argument followed by a value argument.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-named-property-setter
 */
export function validateNamedPropertySetter(op: Operation): void {
  if (op.arguments.length !== 2 || !isDOMStringType(op.arguments[0]!.type)) {
    throw TypeError(
      `A named property setter must take a "DOMString" argument followed by a value argument.`,
    );
  }
}

/**
 * @see https://webidl.spec.whatwg.org/#idl-special-operations
 * @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-a-new-named-property
 * @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-an-existing-named-property
 */
interfaceExtraValidationRules.push((iface) => {
  // § 2.5.6: "If an interface has a setter of a given variety, then it must also
  // have a getter of that variety."
  if (
    NamedPropertySetter in iface.members &&
    !(NamedPropertyGetter in iface.members)
  ) {
    throw TypeError(
      "An interface with a named property setter must also have a named property getter.",
    );
  }

  //  § 2.5.6.2: setting a named property is performed by invoking the setter. When
  // the setter is declared without an identifier the interface must instead
  // supply the anonymous steps to set the value of both new and existing named
  // properties; a named setter sets the value through its own steps.
  const setter = iface.members[NamedPropertySetter];
  if (
    setter !== undefined &&
    setter.identifier === undefined &&
    (!(NewNamedPropertySetter in iface.members) ||
      !(ExistingNamedPropertySetter in iface.members))
  ) {
    throw TypeError(
      "An interface with an unnamed named property setter must define the steps to set the value of both new and existing named properties.",
    );
  }
});
