/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectpositive */
export const ReflectPositive: unique symbol = Symbol("ReflectPositive");

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Attribute<T> {
    [ReflectPositive]?: string | null;
  }
}
