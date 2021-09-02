import { Decoder } from '../types/index'

type GetReturn<T, R> = [T] extends [undefined]
  ? object & { [property: string]: string }
  : R | undefined

export default function <T extends string | undefined>(
  key: T,
  decodeValue: Decoder<any>,
  decodeName: Decoder<string>
): GetReturn<T, typeof decodeValue> {
  const scan = /(?:^|; )([^=]*)=([^;]*)/g
  const jar: any = {}
  let match
  while ((match = scan.exec(document.cookie)) != null) {
    try {
      const foundKey = decodeName(match[1])
      const value = decodeValue(match[2], foundKey)
      jar[foundKey] = value
      if (key === foundKey) {
        break
      }
    } catch (e) {}
  }

  return key != null ? jar[key] : jar
}
