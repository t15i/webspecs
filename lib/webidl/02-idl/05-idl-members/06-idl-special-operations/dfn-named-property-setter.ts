import { isDOMStringType, type Interface, type Operation } from "@webidl";
import type { NamedPropertySetterOperation } from "./02-idl-named-properties";

declare module "@webidl" {
  interface Interface {
    /** @see https://webidl.spec.whatwg.org/#dfn-named-property-setter */
    namedPropertySetter?: NamedPropertySetterOperation;
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
export function validateNamedPropertySetterConstraints(iface: Interface): void {
  // § 2.5.6: "If an interface has a setter of a given variety, then it must also
  // have a getter of that variety."
  if (
    iface.namedPropertySetter !== undefined &&
    !(iface.namedPropertyGetter !== undefined)
  ) {
    throw TypeError(
      "An interface with a named property setter must also have a named property getter.",
    );
  }

  //  § 2.5.6.2: setting a named property is performed by invoking the setter. When
  // the setter is declared without an identifier the interface must instead
  // supply the anonymous steps to set the value of both new and existing named
  // properties; a named setter sets the value through its own steps.
  const setter = iface.namedPropertySetter;
  if (
    setter !== undefined &&
    setter.identifier === undefined &&
    (iface.behaviors.newNamedPropertySetter === undefined ||
      iface.behaviors.existingNamedPropertySetter === undefined)
  ) {
    throw TypeError(
      "An interface with an unnamed named property setter must define the steps to set the value of both new and existing named properties.",
    );
  }
}
