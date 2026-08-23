/** @see https://webidl.spec.whatwg.org/#extended-attributes-applicable-to-types */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TypeExtendedAttributes {}

/** @see https://webidl.spec.whatwg.org/#extended-attributes-applicable-to-types */
export type ApplicableToTypeExtendedAttribute = keyof TypeExtendedAttributes;
