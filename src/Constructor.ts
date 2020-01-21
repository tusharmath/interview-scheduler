export type Constructor<T> = {
  name: string
  of(...t: never[]): T
}
