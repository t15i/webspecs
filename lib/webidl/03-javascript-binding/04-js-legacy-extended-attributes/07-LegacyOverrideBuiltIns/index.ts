/** @see https://webidl.spec.whatwg.org/#LegacyOverrideBuiltIns */
export const LegacyOverrideBuiltIns = "legacyOverrideBuiltIns";

declare module "@webidl" {
  interface InterfaceExtendedAttributes {
    [LegacyOverrideBuiltIns]?: null;
  }
}
