import { isObject } from "@ecma";
import { PlatformObject } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#is-a-platform-object */
export function isPlatformObject(o: unknown): o is PlatformObject {
  return isObject(o) && PlatformObject.getPrimaryInterfaceOf(o) !== undefined;
}
