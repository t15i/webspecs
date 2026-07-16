import type { RegularAttribute, Type } from "@webidl";

/**
 * A reflected IDL attribute is an attribute interface member. Reflection
 * metadata (e.g. `limitedToOnlyKnownValues`, `defaultValue`) is declaration-
 * merged onto {@link Attribute} itself by the individual concept modules, so a
 * reflected IDL attribute is simply an {@link Attribute} whose `type` is fixed.
 *
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflected-idl-attribute
 */
export type ReflectedIDLAttributeOf<T extends Type> = RegularAttribute<T>;
