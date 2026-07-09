/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#set-the-content-attribute */
export function setContentAttributeOfElementReflectedTarget(
  element: Element,
  name: string,
  value: string,
): void {
  element.setAttributeNS(null, name, value);
}
