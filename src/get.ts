import { ReadConverter } from '../types/index'

type GetReturn<T, R> = [T] extends [undefined]
  ? object & { [property: string]: string }
  : R | undefined

export default function <T extends string | undefined>(
  key: T,
  convertValue: ReadConverter<any>,
  convertName: ReadConverter<string>
): GetReturn<T, typeof convertValue> {
  const scan = /(?:^|; )([^=]*)=([^;]*)/g
  const jar: any = {}
  let match
  while ((match = scan.exec(document.cookie)) != null) {
    try {
      const foundKey = convertName(match[1])
      const value = convertValue(match[2], foundKey)
      jar[foundKey] = value
      if (key === foundKey) {
        break
      }
    } catch (e) {}
  }

  return key != null ? jar[key] : jar
}
