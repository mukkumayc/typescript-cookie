import { ReadConverter } from '../types/index'
import { readValue } from './converter'

export default function (
  key: string | undefined,
  converter: ReadConverter
): string | (object & { [property: string]: string }) {
  // To prevent the for loop in the first place assign an empty array
  // in case there are no cookies at all.
  const cookies: string[] =
    document.cookie.length > 0 ? document.cookie.split('; ') : []
  const jar: object & { [property: string]: string } = {}
  for (let i = 0; i < cookies.length; i++) {
    const parts: string[] = cookies[i].split('=')
    let value: string = parts.slice(1).join('=')

    if (value[0] === '"') {
      value = value.slice(1, -1)
    }

    try {
      const foundKey: string = readValue(parts[0])
      jar[foundKey] = converter(value, foundKey)

      if (key === foundKey) {
        break
      }
    } catch (e) {}
  }

  return key != null ? jar[key] : jar
}
