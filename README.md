# webspecs - TypeScript implementations of web platform specifications

A reference implementation of selected algorithms and types from the WHATWG, W3C,
and TC39 specifications. Each module's path mirrors the section ID of the spec
it implements, so navigating the source feels like navigating the spec.

> **Coverage is intentionally narrow** — this is a knowledge base, not a polyfill.
> Only the algorithms that have been ported so far are listed below; everything
> else is marked with `…`.

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
import { ... } from "@t15i/webspecs/url";
import { ... } from "@t15i/webspecs/webidl";
```

## What's implemented

Expand a spec to see what is currently ported. `…` marks sections with un-ported content.

<details>
<summary><strong>DOM</strong> — <a href="https://dom.spec.whatwg.org/">spec</a></summary>

- **§1 Infrastructure**
  - **§1.4 Namespaces**
    - [x] `validAttributeLocalName`
  - …
- …

</details>

<details>
<summary><strong>ECMAScript</strong> — <a href="https://tc39.es/ecma262/">spec</a></summary>

- **§5 Notational Conventions**
  - **§5.2.6 Mathematical Operations**
    - [x] `sign`
    - [x] `modulo`
    - …
  - …
- **§6 ECMAScript Data Types and Values**
  - **§6.1 ECMAScript Language Types**
    - **§6.1.4 The String Type**
      - [x] `isString`
    - **§6.1.7 The Object Type**
      - [x] `PropertyKey`
      - [x] `PropertyName`
    - …
  - **§6.2 ECMAScript Specification Types**
    - **§6.2.6 The Property Descriptor Specification Type**
      - **§6.2.6.1 IsAccessorDescriptor**
        - [x] `isAccessorDescriptor`
      - **§6.2.6.2 IsDataDescriptor**
        - [x] `isDataDescriptor`
      - …
    - …
- **§7 Abstract Operations**
  - **§7.1 Type Conversion**
    - **§7.1.4 ToNumber**
      - [x] `toNumber`
    - **§7.1.5 ToIntegerOrInfinity**
      - [x] `toIntegerOrInfinity`
    - **§7.1.6 ToFixedSizeInteger**
      - [x] `toFixedSizeInteger`
    - **§7.1.8 ToUint32**
      - [x] `toUint32`
    - **§7.1.18 ToString**
      - [x] `toString`
    - **§7.1.22 CanonicalNumericIndexString**
      - [x] `canonicalNumericIndexString`
    - …
  - **§7.3 Operations on Objects**
    - **§7.3.5 CreateDataProperty**
      - [x] `createDataProperty`
    - …
- **§10 Ordinary and Exotic Objects Behaviours**
  - **§10.1 Ordinary Object Internal Methods and Internal Slots**
    - **§10.1.5.1 OrdinaryGetOwnProperty**
      - [x] `ordinaryGetOwnProperty`
    - **§10.1.6.1 OrdinaryDefineOwnProperty**
      - [x] `ordinaryDefineOwnProperty`
    - **§10.1.9.2 OrdinarySetWithOwnDescriptor**
      - [x] `ordinarySetWithOwnDescriptor`
    - …
  - …
- …

</details>

<details>
<summary><strong>HTML</strong> — <a href="https://html.spec.whatwg.org/multipage/">spec</a></summary>

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
      - …
    - …
  - **§2.4 URLs and fetching**
    - **§2.4.2 Resolving URLs**
      - [x] `encodingParseURL`
      - [x] `encodingParseAndSerializeURL`
    - …
  - **§2.6 Common DOM interfaces**
    - **§2.6.1 Reflecting content attributes in IDL attributes**
      - [x] `ReflectedBoolean`
      - [x] `ReflectedDOMString`
      - [x] `ReflectedDouble`
      - [x] `ReflectedLong`
      - [x] `ReflectedNullableDOMString`
      - [x] `ReflectedNullableElement`
      - [x] `ReflectedNullableFrozenArrayOfElements`
      - [x] `ReflectedUnsignedLong`
      - [x] `ReflectedUSVString`
      - [x] `ReflectedContentAttribute` / `ReflectedIDLAttribute` / `ReflectedTarget`
    - …
  - …
- …

</details>

<details>
<summary><strong>Infra</strong> — <a href="https://infra.spec.whatwg.org/">spec</a></summary>

- **§4 Primitive data types**
  - **§4.6 Code points**
    - [x] `surrogate` / `surrogates`
    - [x] `leadingSurrogate` / `leadingSurrogates`
    - [x] `trailingSurrogate` / `trailingSurrogates`
  - **§4.7 Strings**
    - [x] `convertStringIntoScalarValueString`
    - …
  - …
- …

</details>

<details>
<summary><strong>URL</strong> — <a href="https://url.spec.whatwg.org/">spec</a></summary>

- **§4 URLs**
  - **§4.4 URL parsing**
    - [x] `urlParser`
  - **§4.5 URL serializing**
    - [x] `urlSerializer`
  - …
- …

</details>

<details>
<summary><strong>WebIDL</strong> — <a href="https://webidl.spec.whatwg.org/">spec</a></summary>

- **§2 Interface definition language**
  - **§2.1 Names**
    - [x] `Identifier`
    - [x] `isIdentifier`
  - **§2.2 Interfaces**
    - [x] `Interface`
  - **§2.5 Members**
    - **§2.5.2 Attributes**
      - [x] `Attribute`
      - [x] `isAttribute`
    - **§2.5.3 Operations**
      - [x] `Operation`
      - [x] `Argument` / `ArgumentList`
      - [x] `isOperation`
    - **§2.5.6 Special operations**
      - **§2.5.6.1 Indexed properties**
        - [x] `determineValueOfIndexedProperty`
        - [x] `setValueOfNewIndexedProperty` / `NewIndexedPropertySetter`
        - [x] `setValueOfExistingIndexedProperty` / `ExistingIndexedPropertySetter`
        - [x] `supportsIndexedProperties` / `SupportIndexedProperties`
        - [x] `isSupportedPropertyIndex` / `SupportedPropertyIndices`
      - **§2.5.6.2 Named properties**
        - [x] `determineValueOfNamedProperty`
        - [x] `deleteExistingNamedProperty`
        - [x] `setValueOfNewNamedProperty` / `NewNamedPropertySetter`
        - [x] `setValueOfExistingNamedProperty` / `ExistingNamedPropertySetter`
        - [x] `supportsNamedProperties` / `SupportNamedProperties`
        - [x] `isSupportedPropertyName` / `SupportedPropertyNames`
      - …
    - …
  - **§2.12 Objects implementing interfaces**
    - [x] `PlatformObject`
    - [x] `LegacyPlatformObject` / `LegacyPlatformObjectInterfaceBase`
    - [x] `isLegacyPlatformObject`
  - **§2.13 Types**
    - [x] `Type`
  - …
- **§3 ECMAScript binding**
  - **§3.2 ECMAScript type mapping**
    - **§3.2.3 boolean**
      - [x] `Boolean`
    - **§3.2.4 Integer types**
      - **§3.2.4.5 long**
        - [x] `Long` / `LongConstructor`
      - **§3.2.4.6 unsigned long**
        - [x] `UnsignedLong` / `UnsignedLongConstructor`
      - **§3.2.4.9 Abstract operations**
        - [x] `integerPart`
        - [x] `convertToInt`
      - …
    - **§3.2.7 double**
      - [x] `Double`
    - **§3.2.10 DOMString**
      - [x] `DOMString`
    - **§3.2.12 USVString**
      - [x] `USVString`
    - **§3.2.20 Nullable types**
      - [x] `Nullable`
    - **§3.2.21 sequence**
      - [x] `Sequence`
      - [x] `createSequenceFromIterable`
    - **§3.2.27 Frozen array types**
      - [x] `FrozenArray`
    - …
  - **§3.3 Extended attributes**
    - **§3.3.8 [Global]**
      - [x] `Global`
    - …
  - **§3.4 Legacy extended attributes**
    - **§3.4.7 [LegacyOverrideBuiltIns]**
      - [x] `LegacyOverrideBuiltIns`
    - **§3.4.9 [LegacyUnenumerableNamedProperties]**
      - [x] `LegacyUnenumerableNamedProperties`
    - **§3.4.10 [LegacyUnforgeable]**
      - [x] `LegacyUnforgeable`
      - [x] `isUnforgeableOnInterface`
    - …
  - **§3.7 Interfaces**
    - **§3.7.4 Named properties object**
      - [x] `isNamedPropertyObject`
    - …
  - **§3.8 Platform objects**
    - [x] `isPlatformObject`
    - [x] `PrimaryInterface`
    - [x] `ImplementsInterfaceWith` / `ImplementsInterfaceWithout` / `implementsInterfaceWith`
  - **§3.9 Legacy platform objects**
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
  - …
- …

</details>

## License

[MIT](./LICENSE)
