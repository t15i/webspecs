/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectdefault */
export const ReflectDefault = "reflectDefault";

declare module "@webidl" {
  interface AttributeExtendedAttributes {
    [ReflectDefault]?: number;
  }
}
