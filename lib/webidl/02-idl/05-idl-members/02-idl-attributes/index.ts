export * from "./dfn-attribute";
export * from "./dfn-inherit-getter";
export * from "./dfn-read-only";
export * from "./dfn-regular-attribute";

/** @see https://webidl.spec.whatwg.org/#idl-attributes */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StaticAttributeExtendedAttributes {
  // [CrossOriginIsolated], [Exposed], [SameObject], and [SecureContext]
}

/** @see https://webidl.spec.whatwg.org/#idl-attributes */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RegularAttributeExtendedAttributes {
  // [CrossOriginIsolated], [Exposed], [SameObject], and [SecureContext]
  // [LegacyLenientSetter], [LegacyLenientThis], [PutForwards], [Replaceable], [LegacyUnforgeable]
}
