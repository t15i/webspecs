/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflecturl */
export const ReflectURL = "reflectUrl";

declare module "@webidl" {
  interface AttributeExtendedAttributes {
    [ReflectURL]?: string | null;
  }
}
