import { isDistinguishable } from "@webidl";

import type { EffectiveOverloadSet } from "./dfn-effective-overload-set";

type SetElement<S> = S extends Set<infer E> ? E : never;

/**
 * The distinguishing argument index for the entries of an effective overload
 * set: the lowest index `i` such that, for each pair of entries, the types at
 * index `i` are distinguishable.
 *
 * The entries are expected to share the same type list size — the overload
 * resolution algorithm first removes every entry whose type list is not of the
 * resolved argument count, and the distinguishing argument index is only
 * defined for the items of a set with a given type list size.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-distinguishing-argument-index
 */
export function getDistinguishingArgumentIndex(
  overloads: EffectiveOverloadSet,
): number {
  const set: ReadonlySet<SetElement<EffectiveOverloadSet>> = overloads;
  const entries = [...set];

  const typeListSize = entries[0]![1].length;

  for (let i = 0; i < typeListSize; ++i) {
    let allPairsDistinguishable = true;

    for (let a = 0; a < entries.length && allPairsDistinguishable; ++a) {
      for (let b = a + 1; b < entries.length; ++b) {
        if (!isDistinguishable(entries[a]![1][i]!, entries[b]![1][i]!)) {
          allPairsDistinguishable = false;
          break;
        }
      }
    }

    if (allPairsDistinguishable) {
      return i;
    }
  }

  throw TypeError(
    "The entries of the effective overload set have no distinguishing argument index.",
  );
}
