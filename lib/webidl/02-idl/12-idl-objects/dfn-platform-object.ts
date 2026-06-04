import type { PropertyKey } from "@ecma";

/** @see https://webidl.spec.whatwg.org/#dfn-platform-object */
export interface PlatformObject {
  [key: PropertyKey]: unknown;
}
