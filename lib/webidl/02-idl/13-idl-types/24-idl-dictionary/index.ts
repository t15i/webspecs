import type { Type } from "@webidl";

export const DICTIONARY_TYPE_NAME = "dictionary";

/** @see https://webidl.spec.whatwg.org/#idl-Dictionary */
export interface DictionaryType<T = unknown> extends Type<Record<string, T>> {
  name: typeof DICTIONARY_TYPE_NAME;
}

export function isDictionaryType(T: Type): T is DictionaryType {
  return T.name === DICTIONARY_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [DICTIONARY_TYPE_NAME]: DictionaryType;
  }
}
