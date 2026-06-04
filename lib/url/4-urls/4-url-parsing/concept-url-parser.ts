import { failure } from "@share";

/** @see https://url.spec.whatwg.org/#concept-url-parser */
export function urlParser(
  input: string,
  base: URL | null = null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  encoding: string = "UTF-8",
): URL | typeof failure {
  try {
    return new URL(input, base ?? undefined);
  } catch {
    return failure;
  }
}
