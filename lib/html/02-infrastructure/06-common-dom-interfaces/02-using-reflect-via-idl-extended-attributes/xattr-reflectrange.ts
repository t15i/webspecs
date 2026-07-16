/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectrange */
export const ReflectRange: unique symbol = Symbol("ReflectRange");

declare module "@webidl" {
  interface AttributeExtendedAttributes {
    [ReflectRange]?: [number, number];
  }
}
