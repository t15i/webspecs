/** @see https://webidl.spec.whatwg.org/#LegacyNullToEmptyString */
export const LegacyNullToEmptyString: unique symbol = Symbol(
  "LegacyNullToEmptyString",
);

declare module "@webidl" {
  interface TypeExtendedAttributes {
    [LegacyNullToEmptyString]?: null;
  }
}
