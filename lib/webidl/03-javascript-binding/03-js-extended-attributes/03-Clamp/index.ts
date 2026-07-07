/** @see https://webidl.spec.whatwg.org/#Clamp */
export const Clamp: unique symbol = Symbol("Clamp");

declare module "@webidl" {
  interface TypeExtendedAttributes {
    [Clamp]?: null;
  }
}
