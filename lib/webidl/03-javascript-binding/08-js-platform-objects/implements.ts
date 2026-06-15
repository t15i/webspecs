import type { Interface, InterfaceMembers, PlatformObject } from "@webidl";

import { PrimaryInterface, isPlatformObject } from "./is-a-platform-object";

export type ImplementsInterfaceWith<
  T extends PlatformObject,
  K extends keyof T[typeof PrimaryInterface]["members"],
> = Omit<T, typeof PrimaryInterface> & {
  [PrimaryInterface]: Omit<T[typeof PrimaryInterface], "members"> & {
    members: Omit<T[typeof PrimaryInterface]["members"], K> & {
      [P in K]-?: NonNullable<T[typeof PrimaryInterface]["members"][P]>;
    };
  };
};

export type ImplementsInterfaceWithout<
  T extends PlatformObject,
  K extends keyof T[typeof PrimaryInterface]["members"],
> = Omit<T, typeof PrimaryInterface> & {
  [PrimaryInterface]: Omit<T[typeof PrimaryInterface], "members"> & {
    members: Omit<T[typeof PrimaryInterface]["members"], K>;
  };
};

export function implementsInterfaceWith(
  o: object,
  key: keyof InterfaceMembers,
): o is ImplementsInterfaceWith<PlatformObject, typeof key> {
  return isPlatformObject(o) && key in o[PrimaryInterface].members;
}

export type ImplementsInterfaceWithExtAttribute<
  T extends PlatformObject,
  K extends keyof T[typeof PrimaryInterface],
> = Omit<T, typeof PrimaryInterface> & {
  [PrimaryInterface]: Omit<T[typeof PrimaryInterface], K> & {
    [P in K]-?: NonNullable<T[typeof PrimaryInterface][P]>;
  };
};

export type ImplementsInterfaceWithoutExtAttribute<
  T extends PlatformObject,
  K extends keyof T[typeof PrimaryInterface],
> = Omit<T, typeof PrimaryInterface> & {
  [PrimaryInterface]: Omit<T[typeof PrimaryInterface], K>;
};

export function implementsInterfaceWithExtAttribute(
  o: object,
  key: keyof Interface,
): o is ImplementsInterfaceWithExtAttribute<PlatformObject, typeof key> {
  return isPlatformObject(o) && key in o[PrimaryInterface];
}
