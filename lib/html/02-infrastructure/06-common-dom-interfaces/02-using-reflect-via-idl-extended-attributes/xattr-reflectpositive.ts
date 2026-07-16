/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectpositive */
export const ReflectPositive: unique symbol = Symbol("ReflectPositive");

declare module "@webidl" {
  interface AttributeExtendedAttributes {
    [ReflectPositive]?: string | null;
  }
}
