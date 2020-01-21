import {Guid} from 'guid-typescript'

import {Constructor} from './Constructor'

export class ID<T> {
  public static of<T>(ctor: Constructor<T>): ID<T> {
    return new ID(ctor, `${ctor.name}(${Guid.create().toString()})`)
  }
  private constructor(
    public readonly kind: Constructor<T>,
    private readonly value: string
  ) {}

  public equals(id: ID<T>): boolean {
    return id.value === this.value
  }
  public toString(): string {
    return this.value
  }
}
