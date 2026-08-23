/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflect */
export const Reflect = "reflect";

declare module "@webidl" {
  interface AttributeExtendedAttributes {
    [Reflect]?: string | null;
  }
}
