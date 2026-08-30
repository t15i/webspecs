import { splitOnASCIIWhitespace } from "@infra";

import type {
  ReflectedIDLAttribute,
  ReflectedTargetAssociations,
} from "./nullable-frozen-array";
import {
  firstElementInTreeOrderThatMeetsCriteria,
  isDescendantOfShadowIncludingAncestorOf,
} from "./utils";

declare module "./nullable-frozen-array" {
  interface ReflectedTargetAssociations<E extends Element> {
    /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#attr-associated-elements */
    getAssociatedElements(
      reflectedIDLAttribute: ReflectedIDLAttribute<E>,
      reflectedContentAttributeName: string,
    ): E[] | null;
  }
}

export function getAssociatedElements<E extends Element>(
  this: ReflectedTargetAssociations<E>,
  reflectedIDLAttribute: ReflectedIDLAttribute<E>,
  reflectedContentAttributeName: string,
): E[] | null {
  const elements: E[] = [];
  const element = this.getElement();

  if (this.explicitlySetElements !== null) {
    const explicitlySetElements = this.explicitlySetElements
      .map((ref) => ref.deref())
      .filter((el) => el !== undefined);

    for (const attrElement of explicitlySetElements) {
      if (isDescendantOfShadowIncludingAncestorOf(attrElement, element)) {
        elements.push(attrElement);
      }
    }
  } else {
    const contentAttributeValue = this.getContentAttribute(
      reflectedContentAttributeName,
    );

    if (contentAttributeValue === null) {
      return null;
    }

    const tokens = splitOnASCIIWhitespace(contentAttributeValue);

    for (const id of tokens) {
      const candidate = firstElementInTreeOrderThatMeetsCriteria({
        root: element.getRootNode(),
        id,
        T: reflectedIDLAttribute.type.innerType.T.T,
      });

      if (candidate === null) {
        continue;
      }

      elements.push(candidate);
    }
  }

  return elements;
}
