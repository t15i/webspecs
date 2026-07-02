/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectdefault */
export const ReflectDefault: unique symbol = Symbol("ReflectDefault");

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Attribute<T> {
    [ReflectDefault]?: number;
  }
}
