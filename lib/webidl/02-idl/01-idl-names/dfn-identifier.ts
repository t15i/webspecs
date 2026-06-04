/** @see https://webidl.spec.whatwg.org/#prod-identifier */
const identifierRe = /^[_-]?[A-Za-z][0-9A-Z_a-z-]*$/;

/** @see https://webidl.spec.whatwg.org/#dfn-identifier */
export type Identifier = string;

export function isIdentifier(id: string): id is Identifier {
  return identifierRe.test(id);
}
