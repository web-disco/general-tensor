export function assertNever(value: never): never {
  throw new Error(`Unhandled block type: ${JSON.stringify(value)}`);
}
