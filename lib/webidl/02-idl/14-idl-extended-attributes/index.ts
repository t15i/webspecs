import { getExtAttributesAssociatedWith } from "@webidl";
import type {
  AnnotatedType,
  Interface,
  Member,
  Type,
  TypeExtendedAttributes,
} from "@webidl";

/**
 * The extended attributes an annotatable value may carry. A `Type` carries
 * them only when annotated, so it always maps to
 * {@link TypeExtendedAttributes}.
 *
 * @see https://webidl.spec.whatwg.org/#idl-extended-attributes
 */
export type ExtendedAttributesOf<V extends Interface | Member | Type> =
  V extends Type
    ? TypeExtendedAttributes
    : V extends { extendedAttributes: object }
      ? V["extendedAttributes"]
      : never;

export type AnnotatedWithExtendedAttribute<
  V extends Interface | Member | Type,
  K extends keyof ExtendedAttributesOf<V>,
> = V & {
  extendedAttributes: {
    [P in K]-?: Exclude<ExtendedAttributesOf<V>[P], undefined>;
  };
};

/** @see https://webidl.spec.whatwg.org/#idl-extended-attributes */
export function isAnnotatedWithExtAttribute<
  T extends Type,
  K extends keyof ExtendedAttributesOf<T>,
>(
  value: T,
  xattr: K,
): value is AnnotatedType<T> & AnnotatedWithExtendedAttribute<T, K>;

export function isAnnotatedWithExtAttribute<
  V extends Interface | Member,
  K extends keyof ExtendedAttributesOf<V>,
>(value: V, xattr: K): value is AnnotatedWithExtendedAttribute<V, K>;

export function isAnnotatedWithExtAttribute(
  value: Interface | Member | Type,
  xattr: string,
): boolean {
  if (typeof value === "function") {
    return Object.hasOwn(getExtAttributesAssociatedWith(value), xattr);
  }
  return Object.hasOwn(value.extendedAttributes, xattr);
}
