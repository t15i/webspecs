declare module "./nullable-frozen-array" {
  interface ReflectedTargetAssociations<E extends Element> {
    /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#explicitly-set-attr-elements */
    explicitlySetElements: WeakRef<E>[] | null;
  }
}

export {};
