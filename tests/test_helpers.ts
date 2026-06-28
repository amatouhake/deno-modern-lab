export function assert(condition: unknown, message = "Assertion failed."): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function assertEquals(actual: unknown, expected: unknown, message?: string): void {
  if (deepEquals(actual, expected)) {
    return;
  }

  const prefix = message ? `${message}\n` : "";
  throw new Error(
    `${prefix}Expected values to be equal.\nActual:   ${Deno.inspect(actual)}\nExpected: ${
      Deno.inspect(expected)
    }`,
  );
}

function deepEquals(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true;
  }

  if (typeof left !== "object" || left === null || typeof right !== "object" || right === null) {
    return false;
  }

  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
      return false;
    }
    return left.every((item, index) => deepEquals(item, right[index]));
  }

  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const leftKeys = Object.keys(leftRecord).sort();
  const rightKeys = Object.keys(rightRecord).sort();

  if (!deepEquals(leftKeys, rightKeys)) {
    return false;
  }

  return leftKeys.every((key) => deepEquals(leftRecord[key], rightRecord[key]));
}
