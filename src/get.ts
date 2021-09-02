import { Decoder } from '../types/index'

type GetReturn<T, R> = [T] extends [undefined]
  ? object & { [property: string]: string }
  : R | undefined

export default function <T extends string | undefined>(
  name: T,
  decodeValue: Decoder<any>,
  decodeName: Decoder<string>
): GetReturn<T, typeof decodeValue> {
  const scan = /(?:^|; )([^=]*)=([^;]*)/g
  const jar: any = {}
  let match
  while ((match = scan.exec(document.cookie)) != null) {
    try {
      const found = decodeName(match[1])
      const value = decodeValue(match[2], found)
      jar[found] = value
      if (name === found) {
        break
      }
    } catch (e) {}
  }

  return name != null ? jar[name] : jar
}
