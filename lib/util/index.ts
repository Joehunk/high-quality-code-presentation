export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== null && value !== undefined;
}

export const exceptionToError = (e: unknown): Error => (e instanceof Error ? e : new Error(`Unknown error: ${e}`));
