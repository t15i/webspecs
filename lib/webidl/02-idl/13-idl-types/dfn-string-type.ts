import type { Type } from "@webidl";

import { DOM_STRING_TYPE_NAME } from "./17-idl-DOMString";
import { USV_STRING_TYPE_NAME } from "./19-idl-USVString";

export const STRING_TYPE_NAME = "string";

/** @see https://webidl.spec.whatwg.org/#dfn-string-type */
export const STRING_TYPE_NAMES: Set<string> = new Set([
  DOM_STRING_TYPE_NAME,
  USV_STRING_TYPE_NAME,
]);

declare module "@webidl" {
  interface TypeMap {
    [STRING_TYPE_NAME]: Type<string>;
  }
}
