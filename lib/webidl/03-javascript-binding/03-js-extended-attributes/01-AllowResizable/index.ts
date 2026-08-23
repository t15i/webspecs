/** @see https://webidl.spec.whatwg.org/#AllowResizable */
export const AllowResizable = "allowResizable";

declare module "@webidl" {
  interface TypeExtendedAttributes {
    [AllowResizable]?: null;
  }
}
