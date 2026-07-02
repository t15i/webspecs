/** @see https://webidl.spec.whatwg.org/#AllowResizable */
export const AllowResizable: unique symbol = Symbol("AllowResizable");

declare module "@webidl" {
  interface TypeExtendedAttributes {
    [AllowResizable]?: null;
  }
}
