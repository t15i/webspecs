/** @see https://webidl.spec.whatwg.org/#AllowShared */
export const AllowShared: unique symbol = Symbol("AllowShared");

declare module "@webidl" {
  interface TypeExtendedAttributes {
    [AllowShared]?: null;
  }
}
