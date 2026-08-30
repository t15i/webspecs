# webspecs - TypeScript implementations of web platform specifications

A reference implementation of selected algorithms and types from the WHATWG, W3C,
and TC39 specifications. Each module's path mirrors the section ID of the spec
it implements, so navigating the source feels like navigating the spec.

> **Coverage is intentionally narrow** — this is a knowledge base, not a polyfill.
> Only the algorithms that have been ported so far are listed below; everything
> else is marked with `...`.

## Install

```sh
npm install @t15i/webspecs
```

## Usage

Each spec is exposed as its own subpath export:

```ts
import { ... } from "@t15i/webspecs/dom";
import { ... } from "@t15i/webspecs/ecma";
import { ... } from "@t15i/webspecs/html";
import { ... } from "@t15i/webspecs/infra";
import { ... } from "@t15i/webspecs/share";
import { ... } from "@t15i/webspecs/url";
import { ... } from "@t15i/webspecs/webidl";
```

The package is side-effect free and ships per-module ES output, so unused
algorithms are tree-shaken away.

## What's implemented

Expand a spec to see what is currently ported. `...` marks sections with un-ported content.

<details>
<summary><strong>DOM</strong> (<a href="https://dom.spec.whatwg.org/">spec</a>)</summary>

- **§1 Infrastructure**
  - **§1.4 Namespaces**
    - [x] `validAttributeLocalName` / `isValidAttributeLocalName` / `validateAttributeLocalName`
  - ...
- **§4 Nodes**
  - **§4.9 Interface Element**
    - [x] `Element` (`defineContentAttribute` / `getContentAttributeDescriptor`)
    - [x] `ContentAttributeDescriptor`
    - [x] `getID`
    - ...
  - ...
- ...

</details>

<details>
<summary><strong>ECMAScript</strong> (<a href="https://tc39.es/ecma262/">spec</a>)</summary>

- **§5 Notational Conventions**
  - **§5.2.6 Mathematical Operations**
    - [x] `R`
    - [x] `sign`
    - [x] `modulo`
    - [x] `truncate`
    - ...
  - ...
- **§6 ECMAScript Data Types and Values**
  - **§6.1 ECMAScript Language Types**
    - **§6.1.3 The Boolean Type**
      - [x] `isBoolean`
    - **§6.1.4 The String Type**
      - [x] `isString`
    - **§6.1.6 Numeric Types**
      - **§6.1.6.1 The Number Type**
        - [x] `isNumber`
      - **§6.1.6.2 The BigInt Type**
        - [x] `isBigInt`
    - **§6.1.7 The Object Type**
      - [x] `isObject`
      - [x] `PropertyKey`
      - [x] `PropertyName`
    - ...
  - **§6.2 ECMAScript Specification Types**
    - **§6.2.6 The Property Descriptor Specification Type**
      - **§6.2.6.1 IsAccessorDescriptor**
        - [x] `isAccessorDescriptor`
      - **§6.2.6.2 IsDataDescriptor**
        - [x] `isDataDescriptor`
      - ...
    - ...
- **§7 Abstract Operations**
  - **§7.1 Type Conversion**
    - **§7.1.1 ToPrimitive**
      - [x] `toPrimitive`
      - **§7.1.1.1 OrdinaryToPrimitive**
        - [x] `ordinaryToPrimitive`
    - **§7.1.3 ToNumeric**
      - [x] `toNumeric`
    - **§7.1.4 ToNumber**
      - [x] `toNumber`
    - **§7.1.5 ToIntegerOrInfinity**
      - [x] `toIntegerOrInfinity`
    - **§7.1.6 ToFixedSizeInteger**
      - [x] `toFixedSizeInteger`
    - **§7.1.8 ToUint32**
      - [x] `toUint32`
    - **§7.1.14 ToBigInt**
      - [x] `toBigInt`
    - **§7.1.18 ToString**
      - [x] `toString`
    - **§7.1.22 CanonicalNumericIndexString**
      - [x] `canonicalNumericIndexString`
    - ...
  - **§7.2 Testing and Comparison Operations**
    - **§7.2.3 IsCallable**
      - [x] `isCallable`
    - ...
  - **§7.3 Operations on Objects**
    - **§7.3.5 CreateDataProperty**
      - [x] `createDataProperty`
    - **§7.3.6 CreateDataPropertyOrThrow**
      - [x] `createDataPropertyOrThrow`
    - **§7.3.8 DefinePropertyOrThrow**
      - [x] `definePropertyOrThrow`
    - **§7.3.10 GetMethod**
      - [x] `getMethod`
    - ...
  - **§7.4 Operations on Iterator Objects**
    - **§7.4.1 Iterator Records**
      - [x] `IteratorRecord`
    - **§7.4.2 GetIteratorDirect**
      - [x] `getIteratorDirect`
    - **§7.4.3 GetIteratorFromMethod**
      - [x] `getIteratorFromMethod`
    - ...
  - ...
- **§10 Ordinary and Exotic Objects Behaviours**
  - **§10.1 Ordinary Object Internal Methods and Internal Slots**
    - **§10.1.5.1 OrdinaryGetOwnProperty**
      - [x] `ordinaryGetOwnProperty`
    - **§10.1.6.1 OrdinaryDefineOwnProperty**
      - [x] `ordinaryDefineOwnProperty`
    - **§10.1.9.2 OrdinarySetWithOwnDescriptor**
      - [x] `ordinarySetWithOwnDescriptor`
    - **§10.1.12 OrdinaryObjectCreate**
      - [x] `ordinaryObjectCreate`
    - ...
  - **§10.2 ECMAScript Function Objects**
    - **§10.2.8 DefineMethodProperty**
      - [x] `defineMethodProperty`
    - **§10.2.9 SetFunctionName**
      - [x] `setFunctionName`
    - **§10.2.10 SetFunctionLength**
      - [x] `setFunctionLength`
    - ...
  - **§10.3 Built-in Function Objects**
    - **§10.3.4 CreateBuiltinFunction**
      - [x] `createBuiltinFunction` / `CreateBuiltinFunctionOptions`
    - ...
  - **§10.4 Built-in Exotic Object Internal Methods and Slots**
    - **§10.4.3 String Exotic Objects**
      - [x] `hasStringDataInternalSlot`
    - ...
  - ...
- **§23 Indexed Collections**
  - **§23.2 TypedArray Objects**
    - [x] `hasTypedArrayNameInternalSlot`
    - ...
  - ...
- **§25 Structured Data**
  - **§25.1 ArrayBuffer Objects**
    - [x] `hasArrayBufferDataInternalSlot`
  - **§25.2 SharedArrayBuffer Objects**
    - [x] `isSharedArrayBuffer`
  - **§25.3 DataView Objects**
    - [x] `hasDataViewInternalSlot`
  - ...
- ...

</details>

<details>
<summary><strong>HTML</strong> (<a href="https://html.spec.whatwg.org/multipage/">spec</a>)</summary>

- **§2 Infrastructure**
  - **§2.3 Common microsyntaxes**
    - **§2.3.3 Keywords and enumerated attributes**
      - [x] `EnumeratedAttributeState`
      - [x] `EnumeratedAttributeStates`
    - **§2.3.4 Numbers**
      - **§2.3.4.1 Signed integers**
        - [x] `integerParsing`
        - [x] `shortestPossibleStringRepresentingAsValidInteger`
      - **§2.3.4.2 Non-negative integers**
        - [x] `nonNegativeIntegerParsing`
        - [x] `shortestPossibleRepresentingAsValidNonNegativeInteger`
      - **§2.3.4.3 Floating-point numbers**
        - [x] `bestRepresentationAsFloatingPointNumber`
        - [x] `floatingPointNumberParsing`
      - ...
    - ...
  - **§2.4 URLs and fetching**
    - **§2.4.2 Resolving URLs**
      - [x] `encodingParseURL`
      - [x] `encodingParseAndSerializeURL`
    - ...
  - **§2.6 Common DOM interfaces**
    - **§2.6.1 Reflecting content attributes in IDL attributes**
      - Per-type reflection modules, each exposing `ReflectedIDLAttribute`, `getter`
        and `setter` (and `attributeChangeSteps` where the type needs them):
        - [x] `ReflectedBoolean`
        - [x] `ReflectedDOMString`
        - [x] `ReflectedDouble`
        - [x] `ReflectedLong`
        - [x] `ReflectedNullableDOMString`
        - [x] `ReflectedNullableElement`
        - [x] `ReflectedNullableFrozenArrayOfElements`
        - [x] `ReflectedUnsignedLong`
        - [x] `ReflectedUSVString`
      - [x] `ReflectedTarget` / `ReflectedTargetAssociations` / `ReflectedIDLAttributeOf`
      - [x] `getContentAttributeOfElementReflectedTarget`
      - [x] `setContentAttributeOfElementReflectedTarget`
      - [x] `deleteContentAttributeOfElementReflectedTarget`
      - [x] `getElementOfElementReflectedTarget`
      - [x] `getAssociatedElement` / `getAssociatedElements`
      - Reflection constraints:
        - [x] `validateClampedToRange`
        - [x] `validateDefaultValue`
        - [x] `validateLimitedToOnlyKnownValues`
        - [x] `validateLimitedToOnlyNonNegativeNumbers`
        - [x] `validateLimitedToOnlyPositiveNumbers`
        - [x] `validateLimitedToOnlyPositiveNumbersWithFallback`
        - [x] `validateTreatedAsURL`
      - ...
    - **§2.6.2 Using reflect via IDL extended attributes**
      - [x] `Reflect`
      - [x] `ReflectDefault`
      - [x] `ReflectNonNegative`
      - [x] `ReflectPositive`
      - [x] `ReflectPositiveWithFallback`
      - [x] `ReflectRange`
      - [x] `ReflectSetter`
      - [x] `ReflectURL`
      - [x] `ReflectionTrigger` / `reflectionTriggers`
      - [x] `ReflectionSupplements` / `reflectionSupplements`
      - [x] `validateReflectionExtendedAttributes`
    - ...
  - ...
- ...

</details>

<details>
<summary><strong>Infra</strong> (<a href="https://infra.spec.whatwg.org/">spec</a>)</summary>

- **§4 Primitive data types**
  - **§4.6 Code points**
    - [x] `surrogate` / `surrogates`
    - [x] `leadingSurrogate` / `leadingSurrogates`
    - [x] `trailingSurrogate` / `trailingSurrogates`
  - **§4.7 Strings**
    - [x] `convertStringIntoScalarValueString`
    - [x] `splitOnASCIIWhitespace`
    - ...
  - ...
- **§8 Namespaces**
  - [x] `HTMLNamespace`
  - [x] `MathMLNamespace`
  - [x] `SVGNamespace`
  - [x] `XLinkNamespace`
  - [x] `XMLNamespace`
  - [x] `XMLNSNamespace`
- ...

</details>

<details>
<summary><strong>Share</strong> (no spec — cross-spec primitives)</summary>

Values that several specs share and that belong to none of them.

- [x] `failure` — the sentinel returned by algorithms that "return failure"

</details>

<details>
<summary><strong>URL</strong> (<a href="https://url.spec.whatwg.org/">spec</a>)</summary>

- **§4 URLs**
  - **§4.4 URL parsing**
    - [x] `urlParser`
  - **§4.5 URL serializing**
    - [x] `urlSerializer`
  - ...
- ...

</details>

<details>
<summary><strong>WebIDL</strong> (<a href="https://webidl.spec.whatwg.org/">spec</a>)</summary>

- **§2 Interface definition language**
  - **§2.1 Names**
    - [x] `Identifier`
    - [x] `isIdentifier`
  - **§2.2 Interfaces**
    - [x] `Interface` / `InterfaceMembers` / `InterfaceStaticMembers`
    - [x] `InterfaceExtendedAttributes` / `InterfaceBehaviors`
    - [x] `validateInterface` / `interfaceExtraValidationRules`
  - **§2.5 Members**
    - [x] `Member` / `MemberSlot`
    - [x] `iterateMembers` / `iterateMemberSlots`
    - [x] `validateMemberSlot` / `validateRegularMemberSlot`
    - **§2.5.2 Attributes**
      - [x] `Attribute` / `AttributeExtendedAttributes`
      - [x] `isAttribute`
      - [x] `validateAttribute` / `attributeExtraValidationRules`
      - [x] `RegularAttribute` / `isRegularAttribute`
      - [x] `validateRegularAttribute` / `regularAttributeExtraValidationRules`
      - [x] `isReadonlyAttribute` / `validateReadonlyAttribute`
      - [x] `isDeclaredToInheritItsGetterAttribute`
    - **§2.5.3 Operations**
      - [x] `Operation` / `OperationExtendedAttributes`
      - [x] `isOperation`
      - [x] `validateOperation` / `operationExtraValidationRules`
      - [x] `RegularOperation` / `isRegularOperation`
      - [x] `Argument` / `ArgumentList` / `validateArgumentList`
      - [x] `isOptionalArgument`
      - [x] `isDeclaredWithDefaultValue` / `validateArgumentDefaultValue`
    - **§2.5.4 Constructors**
      - [x] `ConstructorOperation` / `ConstructorOperationExtendedAttributes`
      - [x] `isConstructorOperation` / `validateConstructorOperation`
      - [x] `getOwnConstructorOperations`
    - **§2.5.6 Special operations**
      - [x] `SpecialOperation` / `isSpecialOperation` / `validateSpecialOperation`
      - [x] `iterateSpecialOperations`
      - [x] `validateNamedSpecialOperationsAreMembers`
      - [x] `validateAtMostOneSpecialOperationPerVariety`
      - [x] `validateIndexedPropertyGetter` / `validateIndexedPropertyGetterDeterminator`
      - [x] `validateIndexedPropertySetter` / `validateIndexedPropertySetterConstraints`
      - [x] `validateNamedPropertyGetter` / `validateNamedPropertyGetterDeterminator`
      - [x] `validateNamedPropertySetter` / `validateNamedPropertySetterConstraints`
      - [x] `validateNamedPropertyDeleter` / `validateNamedPropertyDeleterConstraints`
      - [x] `interfaceHasIndexedPropertyGetter`
      - **§2.5.6.1 Indexed properties**
        - [x] `IndexedPropertyGetterOperation` / `IndexedPropertySetterOperation`
        - [x] `determineValueOfIndexedProperty`
        - [x] `setValueOfNewIndexedProperty`
        - [x] `setValueOfExistingIndexedProperty`
        - [x] `supportsIndexedProperties` / `isInterfaceSupportIndexedProperties`
        - [x] `isSupportedPropertyIndex` / `SupportedPropertyIndices`
        - [x] `validateIndexedPropertiesLengthAttribute`
        - [x] `validateSupportedPropertyIndicesDefined`
      - **§2.5.6.2 Named properties**
        - [x] `NamedPropertyGetterOperation` / `NamedPropertySetterOperation` / `NamedPropertyDeleterOperation`
        - [x] `determineValueOfNamedProperty`
        - [x] `setValueOfNewNamedProperty`
        - [x] `setValueOfExistingNamedProperty`
        - [x] `deleteExistingNamedProperty`
        - [x] `supportsNamedProperties` / `isInterfaceSupportNamedProperties`
        - [x] `isSupportedPropertyName` / `SupportedPropertyNames`
        - [x] `validateSupportedPropertyNamesDefined`
      - ...
    - **§2.5.8 Overloading**
      - [x] `validateOverloads`
      - [x] `EffectiveOverloadSet` / `computeEffectiveOverloadSet`
      - [x] `OperationEffectiveOverloadSet` / `ConstructorOperationEffectiveOverloadSet` / `LegacyFactoryFunctionEffectiveOverloadSet`
      - [x] `OperationEffectiveOverload` / `ConstructorOperationEffectiveOverload` / `LegacyFactoryFunctionEffectiveOverload`
      - [x] `EffectiveOverloadSetCallable` (and its operation / constructor / legacy-factory variants)
      - [x] `EffectiveOverloadSetEffectiveTypeList` / `EffectiveOverloadSetOptionalityList` / `EffectiveOverloadSetOptionalityValue`
      - [x] `validateEffectiveOverloadSet`
      - [x] `getDistinguishingArgumentIndex`
      - [x] `isDistinguishable` / `getInnermostType`
      - [x] `DISTINCTION_TABLE` / `DISTINCTION_CATEGORY` / `DistinctionRequirement`
      - [x] `INTERFACELIKE_DISTINCTION_CATEGORIES` / `DICTIONARYLIKE_DISTINCTION_CATEGORIES` / `SEQUENCELIKE_DISTINCTION_CATEGORIES`
    - ...
  - **§2.7 Static attributes and operations**
    - [x] `StaticAttribute` / `isStaticAttribute` / `validateStaticAttribute`
    - [x] `StaticOperation` / `isStaticOperation` / `validateStaticOperation`
    - [x] `validateStaticMemberSlot`
  - **§2.12 Objects implementing interfaces**
    - [x] `PlatformObject` (`getPrimaryInterfaceOf` / `setPrimaryInterfaceOf`)
    - [x] `isLegacyPlatformObject`
  - **§2.13 Types**
    - [x] `Type` / `TypeBase` / `TypeMap` / `NativeType`
    - Each type ships its name constant, its type, and its predicate
      (e.g. `LONG_TYPE_NAME`, `LongType`, `isLongType`):
      - [x] `any`, `undefined`, `boolean`, `object`
      - [x] `long` (with `LONG_MIN` / `LONG_MAX`), `unsigned long`, `double`, `bigint`
      - [x] `DOMString`, `ByteString`, `USVString`
      - [x] interface, callback interface, dictionary, callback function
      - [x] nullable (with `validateNullableInnerType`), sequence, async sequence, record
            (with `RecordKeyType` / `validateRecordKeyType`), promise, frozen array, observable array
      - [x] union — `isUnionType`, `getFlattenedMemberTypes`, `includesNullableType`,
            `includesUndefined`, `getNumberOfNullableMemberTypes`, and their validators
      - [x] annotated types — `AnnotatedType`, `isAnnotatedType`, `TypeExtendedAttributes`,
            `ApplicableToTypeExtendedAttribute`, `getExtAttributesAssociatedWith`,
            `validateAnnotatedInnerType`
      - [x] groupings — `IntegerType`, `NumericType`, `StringType` (with their name sets
            and predicates)
    - ...
  - **§2.14 Extended attributes**
    - [x] `ExtendedAttributesOf`
    - [x] `AnnotatedWithExtendedAttribute`
    - [x] `isAnnotatedWithExtAttribute`
  - ...
- **§3 JavaScript binding**
  - **§3.2 JavaScript type mapping**
    - **§3.2.2 undefined**
      - [x] `asUndefined`
    - **§3.2.3 boolean**
      - [x] `asBoolean`
    - **§3.2.4 Integer types**
      - **§3.2.4.5 long**
        - [x] `asLong`
      - **§3.2.4.6 unsigned long**
        - [x] `asUnsignedLong`
      - **§3.2.4.9 Abstract operations**
        - [x] `integerPart`
        - [x] `convertToInt`
      - ...
    - **§3.2.7 double**
      - [x] `asDouble`
    - **§3.2.9 bigint**
      - [x] `asBigInt`
      - [x] `asNumericOrBigint`
    - **§3.2.10 DOMString**
      - [x] `asDOMString`
    - **§3.2.12 USVString**
      - [x] `asUSVString`
    - **§3.2.15 Interface types**
      - [x] `asInterfaceType`
    - **§3.2.20 Nullable types**
      - [x] `asNullable`
    - **§3.2.21 sequence**
      - [x] `asSequence`
      - [x] `createSequenceFromIterable`
    - **§3.2.22 async sequence**
      - [x] `AsyncSequence`
    - **§3.2.23 record**
      - [x] `asRecord`
    - **§3.2.25 Union types**
      - [x] `asUnion`
    - **§3.2.27 Frozen array types**
      - [x] `asFrozenArray` / `createFrozenArray`
      - [x] `createFrozenArrayFromIterable`
    - ...
  - **§3.3 Extended attributes**
    - [x] `AllowResizable`
    - [x] `AllowShared`
    - [x] `Clamp`
    - [x] `EnforceRange`
    - [x] `Exposed` / `validateExposedOverloads`
    - ...
  - **§3.4 Legacy extended attributes**
    - [x] `LegacyNullToEmptyString`
    - [x] `LegacyOverrideBuiltIns`
    - [x] `LegacyTreatNonObjectAsNull`
    - [x] `LegacyUnenumerableNamedProperties`
    - [x] `LegacyUnforgeable` — `isUnforgeableOnInterface`, `isUnforgeable`,
          `validateUnforgeablePlacement`, `validateUnforgeableOverloads`,
          `validateUnforgeableInheritance`
    - ...
  - **§3.6 Overload resolution algorithm**
    - [x] `resolveOverloads`
  - **§3.7 Interfaces**
    - **§3.7.1 Interface object**
      - [x] `InterfaceObject` (`getInterfaceOf` / `setInterfaceOf`)
    - **§3.7.3 Interface prototype object**
      - [x] `InterfacePrototypeObject` (`getInterfaceOf` / `setInterfaceOf`)
    - **§3.7.6 Attributes**
      - [x] `defineAttributes`
      - [x] `defineRegularAttributes` / `defineStaticAttributes`
      - [x] `defineUnforgeableRegularAttributes`
      - [x] `createAttributeGetter` / `createAttributeSetter`
    - **§3.7.7 Operations**
      - [x] `defineOperations`
      - [x] `defineRegularOperations` / `defineStaticOperations`
      - [x] `defineUnforgeableRegularOperations`
      - [x] `createOperationFunction`
    - **§3.7.9 Iterable declarations**
      - [x] `defineTheIterationMethods`
    - ...
  - **§3.8 Platform objects**
    - [x] `isPlatformObject`
    - [x] `implementsInterface`
    - [x] `implementsInterfaceWithExtAttribute`
  - **§3.9 Legacy platform objects**
    - [x] `LegacyPlatformObjectInternalMethods`
    - [x] `isUnforgeablePropertyName`
    - **§3.9.1 `[[GetOwnProperty]]`**
      - [x] `getOwnProperty`
    - **§3.9.2 `[[Set]]`**
      - [x] `set`
    - **§3.9.3 `[[DefineOwnProperty]]`**
      - [x] `defineOwnProperty`
    - **§3.9.4 `[[Delete]]`**
      - [x] `del`
    - **§3.9.5 `[[PreventExtensions]]`**
      - [x] `preventExtensions`
    - **§3.9.6 `[[OwnPropertyKeys]]`**
      - [x] `ownPropertyKeys`
    - **§3.9.7 Abstract operations**
      - [x] `legacyPlatformObjectGetOwnProperty`
      - [x] `isNamedPropertyVisible`
      - [x] `invokeIndexedPropertySetter`
      - [x] `invokeNamedPropertySetter`
      - [x] `isArrayIndex`
  - ...
- ...

</details>

## License

[MIT](./LICENSE)
