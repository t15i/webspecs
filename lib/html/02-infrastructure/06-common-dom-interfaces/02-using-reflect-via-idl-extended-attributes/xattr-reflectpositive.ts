/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectpositive */
export const ReflectPositive = "reflectPositive";

declare module "@webidl" {
  interface AttributeExtendedAttributes {
    [ReflectPositive]?: string | null;
  }
}
