/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectsetter */
export const ReflectSetter: unique symbol = Symbol("ReflectSetter");

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Attribute<T> {
    [ReflectSetter]?: string | null;
  }
}
