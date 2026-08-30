/** @see https://dom.spec.whatwg.org/#concept-id */
export function getID(element: Element): string | null {
  const value = element.getAttribute("id");

  if (value === null || value === "") {
    return null;
  }

  return value;
}
