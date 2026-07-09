declare module "./nullable-frozen-array" {
  interface ReflectedTargetAssociations<E extends Element> {
    /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#cached-attr-associated-elements-object */
    cachedAssociatedElements: readonly E[] | null;
  }
}

export {};
