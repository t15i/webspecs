/** @see https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#keywords-and-enumerated-attributes */
export class EnumeratedAttributeState {
  public readonly canonicalKeyword: string;

  public readonly keywords: ReadonlySet<string>;

  public constructor({
    conformingKeywords,
    nonConformingKeywords,
    canonicalKeyword,
  }: {
    conformingKeywords: Set<string>;
    nonConformingKeywords?: Set<string> | undefined;
    canonicalKeyword?: string | undefined;
  }) {
    this.keywords = new Set([
      ...conformingKeywords,
      ...(nonConformingKeywords ?? []),
    ]);

    if (this.keywords.size === 1) {
      this.canonicalKeyword = this.keywords.values().next().value!;
    } else if (conformingKeywords.size === 1) {
      this.canonicalKeyword = conformingKeywords.values().next().value!;
    } else if (conformingKeywords.size === 2 && conformingKeywords.has("")) {
      this.canonicalKeyword = conformingKeywords
        .values()
        .find((key) => key !== "")!;
    } else if (canonicalKeyword !== undefined) {
      this.canonicalKeyword = canonicalKeyword;
    } else {
      throw Error(
        "Specification bug: The canonical keyword is not specified and cannot be determined implicitly.",
      );
    }
  }
}

/** @see https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#keywords-and-enumerated-attributes */
export class EnumeratedAttributeStates {
  constructor({
    states,
    invalidValueDefault,
    missingValueDefault,
    emptyValueDefault,
  }: {
    states: Iterable<EnumeratedAttributeState>;

    /** @see https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#invalid-value-default */
    invalidValueDefault?: EnumeratedAttributeState | undefined;

    /** @see https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#missing-value-default */
    missingValueDefault?: EnumeratedAttributeState | undefined;

    /** @see https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#empty-value-default */
    emptyValueDefault?: EnumeratedAttributeState | undefined;
  }) {
    for (const state of states) {
      for (const keyword of state.keywords) {
        this.keywordToStateMap_.set(keyword.toLowerCase(), state);
      }
    }

    this.invalidValueDefault_ = invalidValueDefault ?? null;
    this.missingValueDefault_ = missingValueDefault ?? null;
    this.emptyValueDefault_ = emptyValueDefault ?? null;
  }

  public get(
    contentAttributeValue: string | null,
  ): EnumeratedAttributeState | null {
    if (contentAttributeValue === null) {
      if (this.missingValueDefault_ !== null) {
        return this.missingValueDefault_;
      }

      return null;
    }

    const caseInsensiveContentAttributeValue =
      contentAttributeValue.toLowerCase();

    if (this.keywordToStateMap_.has(caseInsensiveContentAttributeValue)) {
      return this.keywordToStateMap_.get(caseInsensiveContentAttributeValue)!;
    }

    if (this.emptyValueDefault_ !== null && contentAttributeValue === "") {
      return this.emptyValueDefault_;
    }

    if (this.invalidValueDefault_ !== null) {
      return this.invalidValueDefault_;
    }

    return null;
  }

  protected keywordToStateMap_: Map<string, EnumeratedAttributeState> =
    new Map();

  protected invalidValueDefault_: EnumeratedAttributeState | null;

  protected missingValueDefault_: EnumeratedAttributeState | null;

  protected emptyValueDefault_: EnumeratedAttributeState | null;
}

declare module "@dom" {
  interface ContentAttributeDescriptor {
    /** @see https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#enumerated-attribute */
    states?: EnumeratedAttributeStates;
  }
}
