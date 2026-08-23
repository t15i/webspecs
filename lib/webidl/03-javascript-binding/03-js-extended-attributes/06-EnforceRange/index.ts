/** @see https://webidl.spec.whatwg.org/#EnforceRange */
export const EnforceRange = "enforceRange";

declare module "@webidl" {
  interface TypeExtendedAttributes {
    [EnforceRange]?: null;
  }
}
