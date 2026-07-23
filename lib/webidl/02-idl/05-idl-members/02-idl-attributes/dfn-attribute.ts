import {
  DICTIONARY_TYPE_NAME,
  RECORD_TYPE_NAME,
  SEQUENCE_TYPE_NAME,
  getInnermostType,
  isDeclaredToInheritItsGetterAttribute,
  isDictionaryType,
  isIdentifier,
  isReadonlyAttribute,
  isRecordType,
  isRegularAttribute,
  isSequenceType,
  isStaticAttribute,
  isUnionType,
  validateReadonlyAttribute,
  validateRegularAttribute,
  validateStaticAttribute,
} from "@webidl";
import type { Identifier, Member, Type } from "@webidl";

/**
 * The single merge target for extended attributes applicable to attributes
 * of any kind.
 *
 * @see https://webidl.spec.whatwg.org/#idl-attributes
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AttributeExtendedAttributes {}

/** @see https://webidl.spec.whatwg.org/#dfn-attribute */
export interface Attribute<T extends Type = Type> {
  kind: "attribute";
  extendedAttributes: AttributeExtendedAttributes;
  keywords: Set<string>;
  identifier: Identifier;
  type: T;
  getterSteps(): ReturnType<T>;
  setterSteps?(value: ReturnType<T>): void;
}

export function isAttribute(member: Member): member is Attribute {
  return member.kind === "attribute";
}

/** @see https://webidl.spec.whatwg.org/#dfn-attribute */
export function validateAttribute(attr: Attribute): void {
  if (!isIdentifier(attr.identifier)) {
    throw TypeError(
      `"${attr.identifier}" is not a valid Web IDL identifier for an attribute.`,
    );
  }

  const type = getInnermostType(attr.type);
  if (
    isSequenceType(type) ||
    isDictionaryType(type) ||
    isRecordType(type) ||
    (isUnionType(type) &&
      (type.flattenedMemberTypes.has(SEQUENCE_TYPE_NAME) ||
        type.flattenedMemberTypes.has(DICTIONARY_TYPE_NAME) ||
        type.flattenedMemberTypes.has(RECORD_TYPE_NAME)))
  ) {
    throw TypeError(
      `The type of an attribute must not be a sequence, dictionary, or record type, nor a union type that has any of those as a member.`,
    );
  }

  if (
    isDeclaredToInheritItsGetterAttribute(attr) &&
    (!isReadonlyAttribute(attr) || isStaticAttribute(attr))
  ) {
    throw TypeError(
      `An attribute declared with "inherit" must be a read-only regular attribute.`,
    );
  }

  if (isRegularAttribute(attr)) {
    validateRegularAttribute(attr);
  } else if (isStaticAttribute(attr)) {
    validateStaticAttribute(attr);
  }

  if (isReadonlyAttribute(attr)) {
    validateReadonlyAttribute(attr);
  } else if (attr.setterSteps === undefined) {
    throw TypeError(`A read-write attribute must define setter steps.`);
  }
}
