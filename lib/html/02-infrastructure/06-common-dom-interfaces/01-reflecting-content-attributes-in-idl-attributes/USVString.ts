import type { USVStringType } from "@webidl";
import { convertStringIntoScalarValueString } from "@infra";
import { failure } from "@share";

import { encodingParseAndSerializeURL } from "@html";

import type { ReflectedIDLAttribute as BaseReflectedIDLAttribute } from "./reflected-idl-attribute";
import type { ReflectedTargetAssociations } from "./reflected-target";

export type ReflectedIDLAttribute = BaseReflectedIDLAttribute<USVStringType>;

export type { ReflectedTargetAssociations };

export function getter(
  this: ReflectedTargetAssociations,
  reflectedIDLAttribute: ReflectedIDLAttribute,
  reflectedContentAttributeName: string,
): string {
  const element = this.getElement();
  const contentAttributeValue = this.getContentAttribute(
    reflectedContentAttributeName,
  );

  if (contentAttributeValue === null) {
    return "";
  }

  if (reflectedIDLAttribute.treatedAsURL === true) {
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
  this: ReflectedTargetAssociations,
  _: ReflectedIDLAttribute,
  reflectedContentAttributeName: string,
  value: string,
): void {
  this.setContentAttribute(reflectedContentAttributeName, value);
}
