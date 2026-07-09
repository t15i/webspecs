declare module "./nullable-element" {
  interface ReflectedTargetAssociations<E extends Element> {
    /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#explicitly-set-attr-element */
    explicitlySetElement: WeakRef<E> | null;
  }
}

export {};
