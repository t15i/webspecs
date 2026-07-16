/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflect */
export const Reflect: unique symbol = Symbol("Reflect");

declare module "@webidl" {
  interface AttributeExtendedAttributes {
    [Reflect]?: string | null;
  }
}
