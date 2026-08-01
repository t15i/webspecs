/**
 * True for a SharedArrayBuffer instance, i.e. an Object whose
 * [[ArrayBufferData]] is a Shared Data Block. Mirrors the IsSharedArrayBuffer
 * abstract operation.
 *
 * `SharedArrayBuffer` is only exposed in cross-origin isolated contexts, so it
 * is feature-detected before use.
 *
 * @see https://tc39.es/ecma262/#sec-sharedarraybuffer-objects
 */
export function isSharedArrayBuffer(v: unknown): boolean {
  return (
    typeof SharedArrayBuffer !== "undefined" && v instanceof SharedArrayBuffer
  );
}
