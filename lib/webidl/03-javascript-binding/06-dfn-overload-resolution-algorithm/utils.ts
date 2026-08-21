import {
  getInnermostType,
  isUnionType,
  NUMERIC_TYPE_NAME,
  NUMERIC_TYPE_NAMES,
  STRING_TYPE_NAME,
  STRING_TYPE_NAMES,
  type Type,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-flattened-union-member-types */
export function leafTypes(T: Type): readonly Type[] {
  const inner = getInnermostType(T);
  return isUnionType(inner) ? inner.flattenedMemberTypes : [inner];
}

function matchesTypeName(T: Type, query: string): boolean {
  return (
    T.name === query ||
    (query === STRING_TYPE_NAME && STRING_TYPE_NAMES.has(T.name)) ||
    (query === NUMERIC_TYPE_NAME && NUMERIC_TYPE_NAMES.has(T.name))
  );
}

/**
 * Whether a type list entry holds the named type at a position, looking through
 * a nullable or annotated wrapper and into the flattened members of a union —
 * the "has one of the following types at position i" test the overload
 * resolution algorithm applies at the distinguishing argument index.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-overload-resolution-algorithm
 */
export function typeIncludes(T: Type, query: string): boolean {
  return leafTypes(T).some((U) => matchesTypeName(U, query));
}
