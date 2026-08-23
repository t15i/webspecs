/** @see https://webidl.spec.whatwg.org/#AllowShared */
export const AllowShared = "allowShared";

declare module "@webidl" {
  interface TypeExtendedAttributes {
    [AllowShared]?: null;
  }
}
