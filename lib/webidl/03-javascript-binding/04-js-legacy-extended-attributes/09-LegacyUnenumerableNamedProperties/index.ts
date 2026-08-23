/** @see https://webidl.spec.whatwg.org/#LegacyUnenumerableNamedProperties */
export const LegacyUnenumerableNamedProperties =
  "legacyUnenumerableNamedProperties";

declare module "@webidl" {
  interface InterfaceExtendedAttributes {
    [LegacyUnenumerableNamedProperties]?: null;
  }
}
