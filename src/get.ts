import { ReadConverter } from '../types/index'
import { readName, readValue } from './converter'

type GetReturn<T, R> = [T] extends [undefined]
  ? object & { [property: string]: string }
  : R | undefined

export default function <T extends string | undefined>(
  key: T,
  converter: ReadConverter<any> = readValue
): GetReturn<T, typeof converter> {
  // To prevent the for loop in the first place assign an empty array
  // in case there are no cookies at all.
  const cookies: string[] =
    document.cookie.length > 0 ? document.cookie.split('; ') : []
  const jar: any = {}
  for (let i = 0; i < cookies.length; i++) {
    const parts: string[] = cookies[i].split('=')
    const value: string = parts.slice(1).join('=')

    try {
      const foundKey: string = readName(parts[0])
      jar[foundKey] = converter(value, foundKey)

      if (key === foundKey) {
        break
      }
    } catch (e) {}
  }

  return key != null ? jar[key] : jar
}
