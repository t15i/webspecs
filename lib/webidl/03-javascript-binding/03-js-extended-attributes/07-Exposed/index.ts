/** @see https://webidl.spec.whatwg.org/#Exposed */
export const Exposed: unique symbol = Symbol("Exposed");

declare module "@webidl" {
  interface InterfaceExtendedAttributes {
    [Exposed]: string;
  }
  interface AttributeExtendedAttributes {
    [Exposed]?: string;
  }

  interface OperationExtendedAttributes {
    [Exposed]?: string;
  }
}
