import {
  isAnnotatedType,
  isAnnotatedWithExtAttribute,
  isDictionaryType,
  isNullableType,
  isUnionType,
  LegacyTreatNonObjectAsNull,
  type InterfaceType,
  type NullableType,
  type Type,
  type UnionType,
} from "@webidl";

import {
  ASYNC_SEQUENCE_TYPE_NAME,
  BIGINT_TYPE_NAME,
  BOOLEAN_TYPE_NAME,
  CALLBACK_FUNCTION_TYPE_NAME,
  CALLBACK_INTERFACE_TYPE_NAME,
  DICTIONARY_TYPE_NAME,
  FROZEN_ARRAY_TYPE_NAME,
  includesNullableType,
  INTERFACE_TYPE_NAME,
  NUMERIC_TYPE_NAME,
  NUMERIC_TYPE_NAMES,
  OBJECT_TYPE_NAME,
  RECORD_TYPE_NAME,
  SEQUENCE_TYPE_NAME,
  STRING_TYPE_NAME,
  STRING_TYPE_NAMES,
  UNDEFINED_TYPE_NAME,
} from "../../13-idl-types";

/** @see https://webidl.spec.whatwg.org/#dfn-distinguishable */
export type DistinctionRequirement = (
  first: Type,
  second: Type,
  raw: { first: Type; second: Type },
) => boolean;

export const INTERFACELIKE_DISTINCTION_CATEGORIES = "interface-like";
export const DICTIONARYLIKE_DISTINCTION_CATEGORIES = "dictionary-like";
export const SEQUENCELIKE_DISTINCTION_CATEGORIES = "sequence-like";

export const DISTINCTION_CATEGORY: Map<string, string> = new Map([
  ...[...NUMERIC_TYPE_NAMES].map((name): [string, string] => [
    name,
    NUMERIC_TYPE_NAME,
  ]),
  ...[...STRING_TYPE_NAMES].map((name): [string, string] => [
    name,
    STRING_TYPE_NAME,
  ]),
  [INTERFACE_TYPE_NAME, INTERFACELIKE_DISTINCTION_CATEGORIES],
  [DICTIONARY_TYPE_NAME, DICTIONARYLIKE_DISTINCTION_CATEGORIES],
  [RECORD_TYPE_NAME, DICTIONARYLIKE_DISTINCTION_CATEGORIES],
  [CALLBACK_INTERFACE_TYPE_NAME, DICTIONARYLIKE_DISTINCTION_CATEGORIES],
  [SEQUENCE_TYPE_NAME, SEQUENCELIKE_DISTINCTION_CATEGORIES],
  [FROZEN_ARRAY_TYPE_NAME, SEQUENCELIKE_DISTINCTION_CATEGORIES],
]);

export const DISTINCTION_TABLE: Map<
  string,
  Map<string, boolean | DistinctionRequirement>
> = new Map([
  [
    UNDEFINED_TYPE_NAME,
    new Map([
      [UNDEFINED_TYPE_NAME, false],
      [DICTIONARYLIKE_DISTINCTION_CATEGORIES, false],
    ]),
  ],
  [BOOLEAN_TYPE_NAME, new Map([[BOOLEAN_TYPE_NAME, false]])],
  [NUMERIC_TYPE_NAME, new Map([[NUMERIC_TYPE_NAME, false]])],
  [BIGINT_TYPE_NAME, new Map([[BIGINT_TYPE_NAME, false]])],
  [STRING_TYPE_NAME, new Map([[STRING_TYPE_NAME, false]])],
  [
    OBJECT_TYPE_NAME,
    new Map([
      [OBJECT_TYPE_NAME, false],
      [INTERFACELIKE_DISTINCTION_CATEGORIES, false],
      [CALLBACK_FUNCTION_TYPE_NAME, false],
      [DICTIONARYLIKE_DISTINCTION_CATEGORIES, false],
      [ASYNC_SEQUENCE_TYPE_NAME, false],
      [SEQUENCELIKE_DISTINCTION_CATEGORIES, false],
    ]),
  ],
  [
    INTERFACELIKE_DISTINCTION_CATEGORIES,
    new Map<string, boolean | DistinctionRequirement>([
      [
        INTERFACELIKE_DISTINCTION_CATEGORIES,
        // TODO (buffer source types): the interface-like category also covers
        // them, and they carry no interface to compare, so they will need a
        // branch of their own here once they are modelled.
        function (first, second) {
          const one = first as InterfaceType;
          const other = second as InterfaceType;
          return (
            one.T !== other.T &&
            !(
              one.T.prototype instanceof other.T ||
              other.T.prototype instanceof one.T
            )
          );
        },
      ],
    ]),
  ],
  [
    CALLBACK_FUNCTION_TYPE_NAME,
    new Map<string, boolean | DistinctionRequirement>([
      [CALLBACK_FUNCTION_TYPE_NAME, false],
      [
        DICTIONARYLIKE_DISTINCTION_CATEGORIES,
        function (_, __, raw) {
          return !isAnnotatedWithExtAttribute(
            raw.first,
            LegacyTreatNonObjectAsNull,
          );
        },
      ],
    ]),
  ],
  [
    DICTIONARYLIKE_DISTINCTION_CATEGORIES,
    new Map([[DICTIONARYLIKE_DISTINCTION_CATEGORIES, false]]),
  ],
  [
    ASYNC_SEQUENCE_TYPE_NAME,
    new Map([
      [ASYNC_SEQUENCE_TYPE_NAME, false],
      [SEQUENCELIKE_DISTINCTION_CATEGORIES, false],
    ]),
  ],
  [
    SEQUENCELIKE_DISTINCTION_CATEGORIES,
    new Map([[SEQUENCELIKE_DISTINCTION_CATEGORIES, false]]),
  ],
]);

// The table states each pair of categories once, in one order, and every
// category it names is a row of its own. Filling in the transposed cells is
// what makes a lookup independent of the order the two types were given in.
for (const [row, cells] of DISTINCTION_TABLE) {
  for (const [column, entry] of [...cells]) {
    if (row === column) {
      continue;
    }

    DISTINCTION_TABLE.get(column)!.set(
      row,
      typeof entry === "function"
        ? (first, second, raw) =>
            entry(second, first, { first: raw.second, second: raw.first })
        : entry,
    );
  }
}

export function getInnermostType(T: Type): Type {
  if (isAnnotatedType(T)) T = T.innerType;
  if (isNullableType(T)) T = T.innerType;
  return T;
}

function getDistinctionTableKey(innermostType: Type) {
  if (DISTINCTION_TABLE.has(innermostType.name)) {
    return innermostType.name;
  }
  return DISTINCTION_CATEGORY.get(innermostType.name);
}

function isUnionOrNullableUnionType(
  T: Type,
): T is UnionType | NullableType<UnionType> {
  return isUnionType(T) || (isNullableType(T) && isUnionType(T.innerType));
}

function isNotDistinguishableWithIncludingNullable(T: Type): boolean {
  return (
    includesNullableType(T) ||
    (isUnionType(T) && T.flattenedMemberTypes.has(DICTIONARY_TYPE_NAME)) ||
    isDictionaryType(T)
  );
}

function isDistinguishableUnionAndT(
  one: UnionType | NullableType<UnionType>,
  other: Type,
): boolean {
  const union = isUnionType(one) ? one : one.innerType;
  return union.memberTypes.every((memberType) =>
    isDistinguishable(memberType, other),
  );
}

function isDistinguishableUnions(
  one: UnionType | NullableType<UnionType>,
  other: UnionType | NullableType<UnionType>,
) {
  const oneUnion = isUnionType(one) ? one : one.innerType;
  const otherUnion = isUnionType(other) ? other : other.innerType;
  return oneUnion.memberTypes.every((oneMemberType) =>
    otherUnion.memberTypes.every((otherMemberType) =>
      isDistinguishable(oneMemberType, otherMemberType),
    ),
  );
}

export function isDistinguishable(first: Type, second: Type): boolean {
  if (
    includesNullableType(first) &&
    isNotDistinguishableWithIncludingNullable(second)
  ) {
    return false;
  }
  if (
    includesNullableType(second) &&
    isNotDistinguishableWithIncludingNullable(first)
  ) {
    return false;
  }

  if (isUnionOrNullableUnionType(first) && isUnionOrNullableUnionType(second)) {
    return isDistinguishableUnions(first, second);
  }

  if (isUnionOrNullableUnionType(first)) {
    return isDistinguishableUnionAndT(first, second);
  }
  if (isUnionOrNullableUnionType(second)) {
    return isDistinguishableUnionAndT(second, first);
  }

  const innermostFirst = getInnermostType(first);
  const innermostSecond = getInnermostType(second);

  const firstKey = getDistinctionTableKey(innermostFirst);
  const secondKey = getDistinctionTableKey(innermostSecond);

  if (firstKey !== undefined && secondKey !== undefined) {
    const distinguishable: boolean | DistinctionRequirement =
      DISTINCTION_TABLE.get(firstKey)!.get(secondKey) ?? true;

    if (typeof distinguishable === "function") {
      return distinguishable(innermostFirst, innermostSecond, {
        first,
        second,
      });
    }

    return distinguishable;
  }

  return false;
}
