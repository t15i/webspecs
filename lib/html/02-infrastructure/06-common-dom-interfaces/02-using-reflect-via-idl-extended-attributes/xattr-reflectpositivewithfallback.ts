/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#xattr-reflectpositivewithfallback */
export const ReflectPositiveWithFallback: unique symbol = Symbol.for(
  "@t15i/webspecs/html/ReflectPositiveWithFallback",
);

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Attribute<T> {
    [ReflectPositiveWithFallback]?: string | undefined;
  }
}
