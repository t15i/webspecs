import { isAnnotatedType } from "@webidl";
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

/**
 * `keyof` over a union keeps only the keys common to every constituent, so a
 * member whose `extendedAttributes` is a union of per-kind interfaces would
 * admit no keys at all. Distributing first yields every key any constituent
 * may carry.
 */
export type ExtendedAttributeKeysOf<V extends Interface | Member | Type> =
  ExtendedAttributesOf<V> extends infer XA
    ? XA extends object
      ? keyof XA
      : never
    : never;

export type AnnotatedWithExtendedAttribute<
  V extends Interface | Member | Type,
  K extends ExtendedAttributeKeysOf<V>,
> = V & {
  extendedAttributes: {
    [P in K]-?: NonNullable<
      Extract<ExtendedAttributesOf<V>, { [Q in P]?: unknown }>[P]
    >;
  };
};

export type AnnotatedWithoutExtendedAttribute<
  V extends Interface | Member | Type,
  K extends keyof ExtendedAttributesOf<V>,
> = V & {
  extendedAttributes: Omit<ExtendedAttributesOf<V>, K>;
};

/** @see https://webidl.spec.whatwg.org/#idl-extended-attributes */
export function isAnnotatedWithExtAttribute<
  T extends Type,
  K extends ExtendedAttributeKeysOf<T>,
>(
  value: T,
  xattr: K,
): value is AnnotatedType<T> & AnnotatedWithExtendedAttribute<T, K>;

export function isAnnotatedWithExtAttribute<
  V extends Interface | Member,
  K extends ExtendedAttributeKeysOf<V>,
>(value: V, xattr: K): value is AnnotatedWithExtendedAttribute<V, K>;

export function isAnnotatedWithExtAttribute(
  value: Interface | Member | Type,
  xattr: symbol,
): boolean {
  if (typeof value === "function") {
    return isAnnotatedType(value) && xattr in value.extendedAttributes;
  }
  return xattr in value.extendedAttributes;
}
