import { isObject } from "@ecma";
import type { Interface, PlatformObject } from "@webidl";

export const PrimaryInterface: unique symbol = Symbol("PrimaryInterface");

declare module "@webidl" {
  interface PlatformObject {
    [PrimaryInterface]: Interface;
  }
}

/** @see https://webidl.spec.whatwg.org/#is-a-platform-object */
export function isPlatformObject(o: unknown): o is PlatformObject {
  return isObject(o) && PrimaryInterface in o;
}
