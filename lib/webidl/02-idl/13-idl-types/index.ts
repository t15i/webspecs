export type Type<T> = (value: unknown) => T;

export function Type<T extends object>(
  T: new (...args: unknown[]) => T,
): Type<T>;

export function Type<T extends object>(
  T: new (...args: unknown[]) => T,
  raw: unknown,
): Type<T>;

/** @see https://webidl.spec.whatwg.org/#js-interface */
export function Type<T extends object>(
  T: new (...args: unknown[]) => T,
  raw?: unknown,
) {
  if (arguments.length < 2) {
    return Type.bind(undefined, T);
  }

  if (!(raw instanceof T)) {
    throw TypeError(`Failed to convert value to '${T.name}'`);
  }

  return raw;
}
