/** @see https://webidl.spec.whatwg.org/#Clamp */
export const Clamp = "clamp";

declare module "@webidl" {
  interface TypeExtendedAttributes {
    [Clamp]?: null;
  }
}
