/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectpositivewithfallback */
export const ReflectPositiveWithFallback: unique symbol = Symbol(
  "ReflectPositiveWithFallback",
);

declare module "@webidl" {
  interface RegularAttributeExtendedAttributes {
    [ReflectPositiveWithFallback]?: string | null;
  }
}
