import type { EffectiveOverloadSetOptionalityValue } from "./dfn-optionality-value";
import type {
  ConstructorOperationEffectiveOverloadSetCallable,
  LegacyFactoryFunctionEffectiveOverloadSetCallable,
  OperationEffectiveOverloadSetCallable,
} from "./effective-overload-set-tuple-callable";
import type { EffectiveOverloadSetEffectiveTypeList } from "./type-list";

/** @see https://webidl.spec.whatwg.org/#dfn-effective-overload-set */
export type EffectiveOverloadSet =
  | OperationEffectiveOverloadSet
  | ConstructorOperationEffectiveOverloadSet
  | LegacyFactoryFunctionEffectiveOverloadSet;

/** @see https://webidl.spec.whatwg.org/#dfn-effective-overload-set */
export type OperationEffectiveOverloadSet = Set<OperationEffectiveOverload>;

/** @see https://webidl.spec.whatwg.org/#dfn-effective-overload-set */
export type ConstructorOperationEffectiveOverloadSet =
  Set<ConstructorOperationEffectiveOverload>;

/** @see https://webidl.spec.whatwg.org/#dfn-effective-overload-set */
export type LegacyFactoryFunctionEffectiveOverloadSet =
  Set<LegacyFactoryFunctionEffectiveOverload>;

/** @see https://webidl.spec.whatwg.org/#dfn-effective-overload-set */
export type OperationEffectiveOverload = [
  OperationEffectiveOverloadSetCallable,
  EffectiveOverloadSetEffectiveTypeList,
  EffectiveOverloadSetOptionalityValue[],
];

/** @see https://webidl.spec.whatwg.org/#dfn-effective-overload-set */
export type ConstructorOperationEffectiveOverload = [
  ConstructorOperationEffectiveOverloadSetCallable,
  EffectiveOverloadSetEffectiveTypeList,
  EffectiveOverloadSetOptionalityValue[],
];

/** @see https://webidl.spec.whatwg.org/#dfn-effective-overload-set */
export type LegacyFactoryFunctionEffectiveOverload = [
  LegacyFactoryFunctionEffectiveOverloadSetCallable,
  EffectiveOverloadSetEffectiveTypeList,
  EffectiveOverloadSetOptionalityValue[],
];
