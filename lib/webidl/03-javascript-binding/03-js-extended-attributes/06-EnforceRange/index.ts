/** @see https://webidl.spec.whatwg.org/#EnforceRange */
export const EnforceRange: unique symbol = Symbol("EnforceRange");

declare module "@webidl" {
  interface TypeExtendedAttributes {
    [EnforceRange]?: null;
  }
}
