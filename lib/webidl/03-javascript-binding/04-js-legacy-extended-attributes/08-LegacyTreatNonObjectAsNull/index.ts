/** @see https://webidl.spec.whatwg.org/#LegacyTreatNonObjectAsNull */
export const LegacyTreatNonObjectAsNull: unique symbol = Symbol(
  "LegacyTreatNonObjectAsNull",
);

declare module "@webidl" {
  interface TypeExtendedAttributes {
    [LegacyTreatNonObjectAsNull]?: null;
  }
}
