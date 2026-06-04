/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflected-target */
export interface ReflectedTarget {
  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#get-the-element */
  getElement(): Element;

  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#get-the-content-attribute */
  getContentAttribute(): string | null;

  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#set-the-content-attribute */
  setContentAttribute(value: string): void;

  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#delete-the-content-attribute */
  deleteContentAttribute(): void;
}
