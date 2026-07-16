/** @see https://webidl.spec.whatwg.org/#LegacyUnforgeable */
export const LegacyUnforgeable: unique symbol = Symbol("LegacyUnforgeable");

declare module "@webidl" {
  interface AttributeExtendedAttributes {
    [LegacyUnforgeable]?: void;
  }
  interface OperationExtendedAttributes {
    [LegacyUnforgeable]?: void;
  }
}
