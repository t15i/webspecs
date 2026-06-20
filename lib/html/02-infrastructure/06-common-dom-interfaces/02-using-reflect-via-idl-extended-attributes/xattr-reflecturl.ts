/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflecturl */
export const ReflectURL: unique symbol = Symbol.for(
  "@t15i/webspecs/html/ReflectURL",
);

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Attribute<T> {
    [ReflectURL]?: string | undefined;
  }
}
