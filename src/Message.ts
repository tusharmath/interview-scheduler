/**
 * Represents a message
 */
export class Message<T, V> {
  public static empty(): Message<unknown, unknown> {
    return new Message(undefined, undefined)
  }
  /**
   * Creates a new instance of a Message.
   */
  public static of<T extends string, V>(type: T, value: V): Message<T, V> {
    return new Message(type, value)
  }

  private constructor(public readonly type: T, public readonly value: V) {}
}
