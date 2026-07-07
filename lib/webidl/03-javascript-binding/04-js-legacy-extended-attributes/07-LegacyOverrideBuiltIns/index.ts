/** @see https://webidl.spec.whatwg.org/#LegacyOverrideBuiltIns */
export const LegacyOverrideBuiltIns: unique symbol = Symbol(
  "LegacyOverrideBuiltIns",
);

declare module "@webidl" {
  interface Interface {
    [LegacyOverrideBuiltIns]?: boolean;
  }
}
