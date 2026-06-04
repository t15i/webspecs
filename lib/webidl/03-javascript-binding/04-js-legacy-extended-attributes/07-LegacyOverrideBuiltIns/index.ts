/** @see https://webidl.spec.whatwg.org/#LegacyOverrideBuiltIns */
export const LegacyOverrideBuiltIns: unique symbol = Symbol.for(
  "@t15i/webspecs/webidl/LegacyOverrideBuiltIns",
);

declare module "@webidl" {
  interface Interface {
    [LegacyOverrideBuiltIns]?: boolean;
  }
}
