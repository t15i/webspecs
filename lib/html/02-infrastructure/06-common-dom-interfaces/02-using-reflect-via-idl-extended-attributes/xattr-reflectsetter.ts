/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectsetter */
export const ReflectSetter = "reflectSetter";

declare module "@webidl" {
  interface AttributeExtendedAttributes {
    [ReflectSetter]?: string | null;
  }
}
