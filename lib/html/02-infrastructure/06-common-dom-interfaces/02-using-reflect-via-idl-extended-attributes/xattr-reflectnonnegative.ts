/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectnonnegative */
export const ReflectNonNegative: unique symbol = Symbol("ReflectNonNegative");

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Attribute<T> {
    [ReflectNonNegative]?: string | null;
  }
}
