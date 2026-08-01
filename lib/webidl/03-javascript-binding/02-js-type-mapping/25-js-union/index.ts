import {
  getMethod,
  hasStringDataInternalSlot,
  isBigInt,
  isBoolean,
  isCallable,
  isNumber,
  isObject,
} from "@ecma";
import {
  asNumericOrBigint,
  ASYNC_SEQUENCE_TYPE_NAME,
  BIGINT_TYPE_NAME,
  BOOLEAN_TYPE_NAME,
  CALLBACK_FUNCTION_TYPE_NAME,
  CALLBACK_INTERFACE_TYPE_NAME,
  createFrozenArrayFromIterable,
  createSequenceFromIterable,
  DICTIONARY_TYPE_NAME,
  FROZEN_ARRAY_TYPE_NAME,
  isInterfaceType,
  isPlatformObject,
  NULLABLE_TYPE_NAME,
  NUMERIC_TYPE_NAME,
  OBJECT_TYPE_NAME,
  RECORD_TYPE_NAME,
  SEQUENCE_TYPE_NAME,
  STRING_TYPE_NAME,
  UNDEFINED_TYPE_NAME,
  type FlattenedMemberTypes,
  type NativeType,
  type Type,
  type UnionType,
} from "@webidl";

/**
 * Decides the "V is a platform object then ..." step of the union conversion.
 *
 * @see https://webidl.spec.whatwg.org/#js-union
 *
 * The spec phrases this step as:
 *
 *     If V is a platform object, then:
 *       - If types includes an interface type that V implements, return V.
 *       - If types includes object, return V.
 *
 * NOTE: Both spec branches are gated behind "V is a platform object", but that
 * guard cannot be reproduced faithfully here. There is no reliable way to tell
 * whether an arbitrary object is a *built-in* platform object without an
 * exhaustive enumeration (or a lookup table) of every such type. This
 * implementation therefore works backwards from the union's own members rather
 * than classifying V up front:
 *
 *   - The `object` branch keeps the `isPlatformObject(v)` check, as that is the
 *     only signal available to it.
 *   - The interface branch is decided solely by `v instanceof type.T`: if the
 *     union lists an interface type that V implements (is an instance of), V is
 *     accepted.
 *
 * A consequence is that a type occupying an interface slot which is not in fact
 * a platform object (semantically invalid, yet syntactically expressible) could
 * cause V to be accepted where the spec would reject it. Because this library
 * ships no implementations of the types themselves, whether such a guard is
 * needed and whether enforcing it is worthwhile at all is left to the
 * discretion of downstream implementers.
 */
function isPlatformObjectAndTypesIncludesObjectOrInterfaceTypeImplementedBy(
  types: FlattenedMemberTypes<Type>,
  v: unknown,
): boolean {
  if (isPlatformObject(v) && types.has(OBJECT_TYPE_NAME)) {
    return true;
  }

  for (const type of types) {
    if (isInterfaceType(type) && v instanceof type.T) {
      return true;
    }
  }

  return false;
}

/** @see https://webidl.spec.whatwg.org/#js-union */
export function asUnion<UnionMembersType extends Type>(
  this: UnionType<UnionMembersType>,
  v: unknown,
): NativeType<UnionMembersType> {
  type T = NativeType<UnionMembersType>;

  const types = this.flattenedMemberTypes;

  if (types.has(UNDEFINED_TYPE_NAME) && v === undefined) {
    return undefined as T;
  }
  if (types.has(NULLABLE_TYPE_NAME) && (v === null || v === undefined)) {
    return null as T;
  }

  if (v === null || v === undefined) {
    if (types.has(DICTIONARY_TYPE_NAME)) {
      return types.get(DICTIONARY_TYPE_NAME)(v) as T;
    }
  }

  if (
    isPlatformObjectAndTypesIncludesObjectOrInterfaceTypeImplementedBy(types, v)
  ) {
    return v as T;
  }

  // Skipped per scope:
  //   If V is an Object with [[ArrayBufferData]] internal slot ...
  //   If V is an Object with [[DataView]] internal slot ...
  //   If V is an Object with [[TypedArrayName]] internal slot ...

  if (isCallable(v)) {
    if (types.has(CALLBACK_FUNCTION_TYPE_NAME)) {
      return types.get(CALLBACK_FUNCTION_TYPE_NAME)(v) as T;
    }
    if (types.has(OBJECT_TYPE_NAME)) {
      return v as T;
    }
  }

  if (isObject(v)) {
    if (types.has(ASYNC_SEQUENCE_TYPE_NAME)) {
      if (!types.has(STRING_TYPE_NAME) || !hasStringDataInternalSlot(v)) {
        if (getMethod(v, Symbol.asyncIterator) !== undefined) {
          return v as T;
        }
        if (getMethod(v, Symbol.iterator) !== undefined) {
          return v as T;
        }
      }
    }

    if (types.has(SEQUENCE_TYPE_NAME)) {
      const method = getMethod(v, Symbol.iterator);
      if (method !== undefined) {
        const iterable = v as Iterable<unknown>;
        return createSequenceFromIterable(
          types.get(SEQUENCE_TYPE_NAME).T,
          iterable,
        ) as T;
      }
    }

    if (types.has(FROZEN_ARRAY_TYPE_NAME)) {
      const method = getMethod(v, Symbol.iterator);
      if (method !== undefined) {
        const iterable = v as Iterable<unknown>;
        return createFrozenArrayFromIterable(
          types.get(FROZEN_ARRAY_TYPE_NAME).T,
          iterable,
        ) as T;
      }
    }

    if (types.has(DICTIONARY_TYPE_NAME)) {
      return types.get(DICTIONARY_TYPE_NAME)(v) as T;
    }

    if (types.has(RECORD_TYPE_NAME)) {
      return types.get(RECORD_TYPE_NAME)(v) as T;
    }

    if (types.has(CALLBACK_INTERFACE_TYPE_NAME)) {
      return types.get(CALLBACK_INTERFACE_TYPE_NAME)(v) as T;
    }

    if (types.has(OBJECT_TYPE_NAME)) {
      return v as T;
    }
  }

  if (isBoolean(v)) {
    if (types.has(BOOLEAN_TYPE_NAME)) {
      return types.get(BOOLEAN_TYPE_NAME)(v) as T;
    }
  }

  if (isNumber(v)) {
    if (types.has(NUMERIC_TYPE_NAME)) {
      return types.get(NUMERIC_TYPE_NAME)(v) as T;
    }
  }

  if (isBigInt(v)) {
    if (types.has(BIGINT_TYPE_NAME)) {
      return types.get(BIGINT_TYPE_NAME)(v) as T;
    }
  }

  if (types.has(STRING_TYPE_NAME)) {
    return types.get(STRING_TYPE_NAME)(v) as T;
  }

  if (types.has(NUMERIC_TYPE_NAME) && types.has(BIGINT_TYPE_NAME)) {
    return asNumericOrBigint(types.get(NUMERIC_TYPE_NAME), v) as T;
  }

  if (types.has(NUMERIC_TYPE_NAME)) {
    return types.get(NUMERIC_TYPE_NAME)(v) as T;
  }

  if (types.has(BOOLEAN_TYPE_NAME)) {
    return types.get(BOOLEAN_TYPE_NAME)(v) as T;
  }

  if (types.has(BIGINT_TYPE_NAME)) {
    return types.get(BIGINT_TYPE_NAME)(v) as T;
  }

  throw TypeError(
    "The provided value is not convertible to any of the union member types",
  );
}
