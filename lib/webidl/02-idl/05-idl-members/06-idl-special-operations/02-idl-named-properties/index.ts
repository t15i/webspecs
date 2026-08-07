import { NamedPropertyGetter, SupportedPropertyNames } from "@webidl";
import type { Interface, Type, SpecialOperation, DOMStringType } from "@webidl";

export * from "./dfn-delete-an-existing-named-property";
export * from "./dfn-determine-the-value-of-a-named-property";
export * from "./dfn-set-the-value-of-a-new-named-property";
export * from "./dfn-set-the-value-of-an-existing-named-property";
export * from "./dfn-support-named-properties";
export * from "./dfn-supported-property-names";

/** @see https://webidl.spec.whatwg.org/#idl-indexed-properties */
export type NamedPropertyGetterOperation<T extends Type = Type> =
  SpecialOperation<[DOMStringType], T>;

/** @see https://webidl.spec.whatwg.org/#idl-indexed-properties */
export type NamedPropertyDeleterOperation<Return extends Type = Type> =
  SpecialOperation<[DOMStringType], Return>;

/** @see https://webidl.spec.whatwg.org/#idl-indexed-properties */
export type NamedPropertySetterOperation<
  T extends Type = Type,
  Return extends Type = Type,
> = SpecialOperation<[DOMStringType, T], Return>;

/**
 * § 2.5.6.2: an interface that supports named properties must define a way to
 * determine its supported property names. An interface supports named
 * properties when it defines a named property getter.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-supported-property-names
 */
export function validateSupportedPropertyNamesDefined(iface: Interface): void {
  if (
    NamedPropertyGetter in iface.members &&
    !(SupportedPropertyNames in iface.members)
  ) {
    throw TypeError(
      "An interface that supports named properties must define its supported property names.",
    );
  }
}
