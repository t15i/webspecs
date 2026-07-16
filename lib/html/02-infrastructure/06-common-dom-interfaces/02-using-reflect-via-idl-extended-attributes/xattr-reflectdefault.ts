/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectdefault */
export const ReflectDefault: unique symbol = Symbol("ReflectDefault");

declare module "@webidl" {
  interface RegularAttributeExtendedAttributes {
    [ReflectDefault]?: number;
  }
}
