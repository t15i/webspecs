/** @see https://webidl.spec.whatwg.org/#LegacyTreatNonObjectAsNull */
export const LegacyTreatNonObjectAsNull = "legacyTreatNonObjectAsNull";

declare module "@webidl" {
  interface TypeExtendedAttributes {
    [LegacyTreatNonObjectAsNull]?: null;
  }
}
