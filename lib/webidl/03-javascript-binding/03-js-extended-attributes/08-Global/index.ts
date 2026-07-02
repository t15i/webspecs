/** @see https://webidl.spec.whatwg.org/#Global */
export const Global: unique symbol = Symbol("Global");

declare module "@webidl" {
  interface Interface {
    [Global]?: object | object[];
  }
}
