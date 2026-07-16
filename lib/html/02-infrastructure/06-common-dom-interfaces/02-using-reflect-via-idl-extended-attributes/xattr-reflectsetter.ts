/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectsetter */
export const ReflectSetter: unique symbol = Symbol("ReflectSetter");

declare module "@webidl" {
  interface RegularAttributeExtendedAttributes {
    [ReflectSetter]?: string | null;
  }
}
