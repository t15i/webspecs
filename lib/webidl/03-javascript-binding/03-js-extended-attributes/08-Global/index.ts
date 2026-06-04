/** @see https://webidl.spec.whatwg.org/#Global */
export const Global: unique symbol = Symbol.for("@t15i/web-spec/webidl/Global");

declare module "@webidl" {
  interface Interface {
    [Global]?: boolean;
  }
}
