import { convertStringIntoScalarValueString } from "@infra";
import { failure } from "@share";

import { encodingParseAndSerializeURL } from "@html";

import type { ReflectedContentAttribute } from "./reflected-content-attribute";
import type { ReflectedIDLAttribute as BaseReflectedIDLAttribute } from "./reflected-idl-attribute";
import type { ReflectedTarget } from "./reflected-target";

export type { ReflectedTarget, ReflectedContentAttribute };

export interface ReflectedIDLAttribute extends BaseReflectedIDLAttribute {
  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#treated-as-a-url */
  readonly treatedAsURL: boolean;
}

export function getter(
  this: ReflectedTarget,
  reflectedIDLAttribute: ReflectedIDLAttribute,
): string {
  const element = this.getElement();
  const contentAttributeValue = this.getContentAttribute();

  if (contentAttributeValue === null) {
    return "";
  }

  if (reflectedIDLAttribute.treatedAsURL) {
    const urlString = encodingParseAndSerializeURL(
      contentAttributeValue,
      element.ownerDocument,
    );

    if (urlString !== failure) {
      return urlString;
    }
  }

  return convertStringIntoScalarValueString(contentAttributeValue);
}

export function setter(
  this: ReflectedTarget,
  _: ReflectedIDLAttribute,
  __: ReflectedContentAttribute,
  value: string,
): void {
  this.setContentAttribute(value);
}
