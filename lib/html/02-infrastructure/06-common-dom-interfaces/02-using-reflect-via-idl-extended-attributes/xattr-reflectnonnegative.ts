/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectnonnegative */
export const ReflectNonNegative: unique symbol = Symbol("ReflectNonNegative");

declare module "@webidl" {
  interface AttributeExtendedAttributes {
    [ReflectNonNegative]?: string | null;
  }
}
