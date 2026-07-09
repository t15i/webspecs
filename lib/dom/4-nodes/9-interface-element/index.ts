import { isValidAttributeLocalName } from "@dom";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ContentAttributeDescriptor {}

class ElementConstructor {
  static #descriptors = new WeakMap<
    object,
    Map<string, ContentAttributeDescriptor>
  >();

  /**
   * Defines a content attribute by descriptor.
   *
   * @param constructor - the element constructor for which the content
   * attribute to be defined
   * @param name - the name of the content attribute to be defined
   * @param descriptor - the content attribute descriptor to be applied
   *
   * @returns The construcor passed to the function
   *
   * @throws DOMException("InvalidCharacterError") if `name` is not valid
   * attribute local name
   */
  static defineContentAttribute<Ctor extends new (...args: never[]) => Element>(
    constructor: Ctor,
    name: string,
    descriptor: ContentAttributeDescriptor,
  ): Ctor {
    if (!isValidAttributeLocalName(name)) {
      throw new DOMException(
        `'${name}' is not a valid attribute local name`,
        "InvalidCharacterError",
      );
    }

    let descriptors = this.#descriptors.get(constructor.prototype);

    if (descriptors === undefined) {
      descriptors = new Map();
      this.#descriptors.set(constructor.prototype, descriptors);
    }

    descriptors.set(name, { ...descriptor });

    return constructor;
  }

  /**
   * Resolves the content attribute descriptor for an element.
   *
   * @param object - the object for which the content attribute descriptor to be
   * resolved
   * @param name - the name of the content attribute to be resolved
   *
   * @returns Content-attribute descriptor for the specified object and name if
   * defined, `undefined` otherwise
   */
  static getContentAttributeDescriptor(
    object: Element,
    name: string,
  ): ContentAttributeDescriptor | undefined {
    let current: object | null = object;

    while (current !== null) {
      const descriptor = this.#descriptors.get(current)?.get(name);

      if (descriptor !== undefined) {
        return { ...descriptor };
      }

      current = Object.getPrototypeOf(current) as object | null;
    }

    return undefined;
  }

  constructor() {
    throw TypeError("Illegal constructor");
  }
}

export const Element: typeof ElementConstructor = ElementConstructor;
