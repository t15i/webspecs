/** @see https://webidl.spec.whatwg.org/#LegacyUnenumerableNamedProperties */
export const LegacyUnenumerableNamedProperties: unique symbol = Symbol(
  "LegacyUnenumerableNamedProperties",
);

declare module "@webidl" {
  interface Interface {
    [LegacyUnenumerableNamedProperties]?: boolean;
  }
}
