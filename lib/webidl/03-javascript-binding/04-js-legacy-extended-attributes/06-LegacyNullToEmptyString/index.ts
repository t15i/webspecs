/** @see https://webidl.spec.whatwg.org/#LegacyNullToEmptyString */
export const LegacyNullToEmptyString = "legacyNullToEmptyString";

declare module "@webidl" {
  interface TypeExtendedAttributes {
    [LegacyNullToEmptyString]?: null;
  }
}
