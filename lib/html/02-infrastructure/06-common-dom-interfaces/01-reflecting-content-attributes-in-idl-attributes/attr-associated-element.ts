import type {
  ReflectedIDLAttribute,
  ReflectedTargetAssociations,
} from "./nullable-element";
import { firstElementInTreeOrderThatMeetsCriteria } from "./utils";

declare module "./nullable-element" {
  interface ReflectedTargetAssociations<E extends Element> {
    /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#attr-associated-element */
    getAssociatedElement(
      reflectedIDLAttribute: ReflectedIDLAttribute<E>,
      reflectedContentAttributeName: string,
    ): E | null;
  }
}

export function getAssociatedElement<E extends Element>(
  this: ReflectedTargetAssociations<E>,
  reflectedIDLAttribute: ReflectedIDLAttribute<E>,
  reflectedContentAttributeName: string,
): E | null {
  const element = this.getElement();
  const contentAttributeValue = this.getContentAttribute(
    reflectedContentAttributeName,
  );

  if (this.explicitlySetElement !== null) {
    const attrElement = this.explicitlySetElement.deref();

    if (attrElement?.getRootNode() === element.getRootNode()) {
      return attrElement;
    }

    return null;
  } else if (contentAttributeValue !== null) {
    const candidate = firstElementInTreeOrderThatMeetsCriteria({
      root: element.getRootNode(),
      id: contentAttributeValue,
      T: reflectedIDLAttribute.type.innerType.T,
    });

    if (candidate !== null) {
      return candidate;
    }

    return null;
  }

  return null;
}
