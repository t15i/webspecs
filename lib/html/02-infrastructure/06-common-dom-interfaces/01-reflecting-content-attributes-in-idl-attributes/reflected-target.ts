/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflected-target */
export type ReflectedTarget = Element | ElementInternals;

export interface ReflectedTargetAssociations {
  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#get-the-element */
  getElement(): Element;

  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#get-the-content-attribute */
  getContentAttribute(name: string): string | null;

  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#set-the-content-attribute */
  setContentAttribute(name: string, value: string): void;

  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#delete-the-content-attribute */
  deleteContentAttribute(name: string): void;
}
