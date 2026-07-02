/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflect */
export const Reflect: unique symbol = Symbol("Reflect");

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Attribute<T> {
    [Reflect]?: string | null;
  }
}
