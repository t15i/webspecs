/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflecturl */
export const ReflectURL: unique symbol = Symbol("ReflectURL");

declare module "@webidl" {
  interface RegularAttributeExtendedAttributes {
    [ReflectURL]?: string | null;
  }
}
