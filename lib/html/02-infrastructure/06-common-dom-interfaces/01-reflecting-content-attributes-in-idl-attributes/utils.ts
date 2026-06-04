export function firstElementInTreeOrderThatMeetsCriteria<
  T extends Element,
>(criteria: { root: Node; id: string; T: new () => T }): T | null {
  // If the type T inherits from HTMLElement, then optimization is available:
  if (criteria.T.prototype instanceof HTMLElement) {
    const document =
      criteria.root instanceof Document
        ? criteria.root
        : criteria.root.ownerDocument!;

    let element: Element | null;
    if (
      (element = document?.getElementById(criteria.id) ?? null) !== null &&
      element.getRootNode() === criteria.root &&
      element instanceof criteria.T
    ) {
      return element;
    }
  }

  const walker = document.createTreeWalker(
    criteria.root,
    NodeFilter.SHOW_ELEMENT,
    function (element) {
      if (element instanceof criteria.T && element.id === criteria.id) {
        return NodeFilter.FILTER_ACCEPT;
      }

      return NodeFilter.FILTER_REJECT;
    },
  );

  return walker.nextNode() as T | null;
}
