/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#get-the-content-attribute */
export function getContentAttributeOfElementReflectedTarget(
  element: Element,
  name: string,
): string | null {
  const attribute = element.getAttributeNodeNS(null, name);

  if (attribute === null) {
    return null;
  }

  return attribute.value;
}
