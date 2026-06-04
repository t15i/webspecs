import type { Interface, PlatformObject } from "@webidl";

export const PrimaryInterface: unique symbol = Symbol.for(
  "@t15i/web-spec/webidl/PrimaryInterface",
);

declare module "@webidl" {
  interface PlatformObject {
    [PrimaryInterface]: Interface;
  }
}

/** @see https://webidl.spec.whatwg.org/#is-a-platform-object */
export function isPlatformObject(o: object): o is PlatformObject {
  return PrimaryInterface in o;
}
