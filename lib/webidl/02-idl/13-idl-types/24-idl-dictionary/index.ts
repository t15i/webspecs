import type { Type, TypeBase } from "@webidl";

export const DICTIONARY_TYPE_NAME = "dictionary";

/** @see https://webidl.spec.whatwg.org/#idl-Dictionary */
export interface DictionaryType<T = unknown> extends TypeBase<
  Record<string, T>
> {
  name: typeof DICTIONARY_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#idl-Dictionary */
export function isDictionaryType(T: Type): T is DictionaryType {
  return T.name === DICTIONARY_TYPE_NAME;
}
