import { convertStringIntoScalarValueString } from "@infra";
import { DOMString } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#js-USVString */
export function USVString(raw: unknown): string {
  const string = DOMString(raw);
  return convertStringIntoScalarValueString(string);
}
