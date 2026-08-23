/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectrange */
export const ReflectRange = "reflectRange";

declare module "@webidl" {
  interface AttributeExtendedAttributes {
    [ReflectRange]?: [number, number];
  }
}
