/** @see https://webidl.spec.whatwg.org/#LegacyUnforgeable */
export const LegacyUnforgeable: unique symbol = Symbol("LegacyUnforgeable");

declare module "@webidl" {
  interface RegularAttributeExtendedAttributes {
    [LegacyUnforgeable]: void;
  }
  interface RegularOperationExtendedAttributes {
    [LegacyUnforgeable]: void;
  }
  interface SpecialOperationExtendedAttributes {
    [LegacyUnforgeable]: void;
  }
}
