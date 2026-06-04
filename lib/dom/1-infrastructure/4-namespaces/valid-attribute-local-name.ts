/** @see https://dom.spec.whatwg.org/#valid-attribute-local-name */
export const validAttributeLocalName: RegExp =
  /^(?:[A-Za-z][^\0\t\n\f\r\u0020/>]*|[:_\u0080-\u{10FFFF}][A-Za-z0-9-.:_\u0080-\u{10FFFF}]*)$/u;
