export function Nullable<T>(
  T: (raw: unknown) => NonNullable<T>,
  includesUndefined?: false,
): (raw: unknown) => NonNullable<T> | null;

export function Nullable<T>(
  T: (raw: unknown) => NonNullable<T> | undefined,
  includesUndefined: true,
): (raw: unknown) => NonNullable<T> | undefined | null;

/** @see https://webidl.spec.whatwg.org/#js-nullable-type */
export function Nullable<T>(
  T: (raw: unknown) => T,
  includesUndefined: boolean = false,
) {
  return function (raw: unknown) {
    return Nullable_<T>(T, raw, includesUndefined);
  };
}

function Nullable_<T>(
  T: (raw: unknown) => T,
  raw: unknown,
  includesUndefined?: boolean,
) {
  if (raw === undefined && includesUndefined) {
    return undefined;
  }

  if (raw === null) {
    return null;
  }

  return T(raw);
}
