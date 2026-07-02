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
  type Type,
  type UnionType,
} from "@webidl";

function includesInterfaceTypeImplementedBy(
  types: FlattenedMemberTypes<Type>,
  v: object,
): boolean {
  for (const type of types) {
    if (isInterfaceType(type) && v instanceof type.T) {
      return true;
    }
  }
  return false;
}

/** @see https://webidl.spec.whatwg.org/#js-union */
export function asUnion<T>(this: UnionType<Type<T>>, v: unknown): T {
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

  if (isPlatformObject(v)) {
    if (includesInterfaceTypeImplementedBy(types, v)) {
      return v as T;
    }
    if (types.has(OBJECT_TYPE_NAME)) {
      return v as T;
    }
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
    if (isBigInt(v)) {
      return types.get(BIGINT_TYPE_NAME)(v) as T;
    } else {
      return types.get(NUMERIC_TYPE_NAME)(v) as T;
    }
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
