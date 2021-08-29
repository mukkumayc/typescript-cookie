import { ReadConverter } from '../types/index'
import { readName, readValue } from './converter'

type GetReturn<T, R> = [T] extends [undefined]
  ? object & { [property: string]: string }
  : R | undefined

export default function <T extends string | undefined>(
  key: T,
  converter: ReadConverter<any> = readValue
): GetReturn<T, typeof converter> {
  const scan = /(?:^|; )([^=]*)=([^;]*)/g
  const jar: any = {}
  let match
  while ((match = scan.exec(document.cookie)) != null) {
    try {
      const foundKey = readName(match[1])
      const value = converter(match[2], foundKey)
      jar[foundKey] = value
      if (key === foundKey) {
        break
      }
    } catch (e) {}
  }

  return key != null ? jar[key] : jar
}
