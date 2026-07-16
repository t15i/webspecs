/** @see https://webidl.spec.whatwg.org/#Exposed */
export const Exposed: unique symbol = Symbol("EnforceRange");

declare module "@webidl" {
  interface RegularAttributeExtendedAttributes {
    [Exposed]?: object | object[] | string;
  }

  interface StaticAttributeExtendedAttributes {
    [Exposed]?: object | object[] | string;
  }
}
