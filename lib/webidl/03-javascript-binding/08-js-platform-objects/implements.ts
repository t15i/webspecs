import type { Interface, PlatformObject } from "webidl";

import { PrimaryInterface, isPlatformObject } from "./is-a-platform-object";

export type ImplementsInterfaceWith<
  T extends PlatformObject,
  K extends keyof T[typeof PrimaryInterface],
> = Omit<T, typeof PrimaryInterface> & {
  [PrimaryInterface]: Omit<T[typeof PrimaryInterface], K> & {
    [P in K]-?: NonNullable<T[typeof PrimaryInterface][P]>;
  };
};

export type ImplementsInterfaceWithout<
  T extends PlatformObject,
  K extends keyof T[typeof PrimaryInterface],
> = Omit<T, typeof PrimaryInterface> & {
  [PrimaryInterface]: Omit<T[typeof PrimaryInterface], K>;
};

/** @see https://webidl.spec.whatwg.org/#implements */
export function implementsInterfaceWith(
  o: object,
  key: keyof Interface,
): o is ImplementsInterfaceWith<PlatformObject, typeof key> {
  return isPlatformObject(o) && key in o[PrimaryInterface];
}
