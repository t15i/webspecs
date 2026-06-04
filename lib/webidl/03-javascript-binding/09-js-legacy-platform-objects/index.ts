import { getOwnProperty } from "./01-legacy-platform-object-getownproperty";
import { set } from "./02-legacy-platform-object-set";
import { defineOwnProperty } from "./03-legacy-platform-object-defineownproperty";
import { del } from "./04-legacy-platform-object-delete";
import { preventExtensions } from "./05-legacy-platform-object-preventextensions";
import { ownPropertyKeys } from "./06-legacy-platform-object-ownpropertykeys";

export const LegacyPlatformObjectInternalMethods: {
  getOwnProperty: typeof getOwnProperty;
  set: typeof set;
  defineOwnProperty: typeof defineOwnProperty;
  delete: typeof del;
  preventExtensions: typeof preventExtensions;
  ownPropertyKeys: typeof ownPropertyKeys;
} = {
  getOwnProperty,
  set,
  defineOwnProperty,
  delete: del,
  preventExtensions,
  ownPropertyKeys,
};

export * from "./07-legacy-platform-object-abstract-ops";

export * from "./dfn-unforgeable-property-name";
