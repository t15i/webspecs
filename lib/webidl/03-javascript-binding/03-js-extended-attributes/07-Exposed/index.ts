/** @see https://webidl.spec.whatwg.org/#Exposed */
export const Exposed: unique symbol = Symbol("Exposed");

declare module "@webidl" {
  interface InterfaceExtenedeAttributes {
    [Exposed]: object | object[] | string;
  }
  interface AttributeExtendedAttributes {
    [Exposed]?: object | object[] | string;
  }

  interface OperationExtendedAttributes {
    [Exposed]?: object | object[] | string;
  }
}
