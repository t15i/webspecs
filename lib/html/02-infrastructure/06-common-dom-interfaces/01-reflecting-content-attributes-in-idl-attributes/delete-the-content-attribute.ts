/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#delete-the-content-attribute */
export function deleteContentAttributeOfElementReflectedTarget(
  element: Element,
  name: string,
): void {
  element.removeAttributeNS(null, name);
}
