/**
 * Utility functions for object operations.
 */
export class ObjectUtils {
  /**
   * Combines multiple objects into a target object.
   * @param target - The target object to which properties will be added.
   * @param sources - One or more source objects containing properties to add.
   * @returns The modified target object.
   */
  static merge<T extends object>(target: T, ...sources: Partial<T>[]): T {
    return Object.assign(target, ...sources);
  }
}

/**
 * Utility functions for array operationss.
 */
