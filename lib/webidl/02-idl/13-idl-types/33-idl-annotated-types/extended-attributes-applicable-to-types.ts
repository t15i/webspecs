import {
  AllowResizable,
  AllowShared,
  Clamp,
  EnforceRange,
} from "../../../03-javascript-binding/03-js-extended-attributes";
import { LegacyNullToEmptyString } from "../../../03-javascript-binding/04-js-legacy-extended-attributes";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TypeExtendedAttributes {}

export type ApplicableToTypeExtendedAttribute = keyof TypeExtendedAttributes;

/** @see https://webidl.spec.whatwg.org/#extended-attributes-applicable-to-types */
export const APPLICABLE_TO_TYPE_EXT_ATTRIBUTES: Set<ApplicableToTypeExtendedAttribute> =
  new Set([
    AllowResizable,
    AllowShared,
    Clamp,
    EnforceRange,
    LegacyNullToEmptyString,
  ]);
