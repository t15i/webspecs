/** @see https://webidl.spec.whatwg.org/#LegacyUnenumerableNamedProperties */
export const LegacyUnenumerableNamedProperties: unique symbol = Symbol.for(
  "@t15i/web-spec/webidl/LegacyUnenumerableNamedProperties",
);

declare module "@webidl" {
  interface Interface {
    [LegacyUnenumerableNamedProperties]?: boolean;
  }
}
