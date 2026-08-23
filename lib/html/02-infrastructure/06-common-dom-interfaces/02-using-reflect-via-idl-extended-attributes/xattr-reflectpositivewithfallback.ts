/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectpositivewithfallback */
export const ReflectPositiveWithFallback = "reflectPositiveWithFallback";

declare module "@webidl" {
  interface AttributeExtendedAttributes {
    [ReflectPositiveWithFallback]?: string | null;
  }
}
