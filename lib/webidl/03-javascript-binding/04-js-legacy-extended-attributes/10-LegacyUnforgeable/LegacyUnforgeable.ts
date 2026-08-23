/** @see https://webidl.spec.whatwg.org/#LegacyUnforgeable */
export const LegacyUnforgeable = "legacyUnforgeable";

declare module "@webidl" {
  interface AttributeExtendedAttributes {
    [LegacyUnforgeable]?: null;
  }
  interface OperationExtendedAttributes {
    [LegacyUnforgeable]?: null;
  }
}
