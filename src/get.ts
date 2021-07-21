import { CookieConverter } from '../types/index'
import defaultConverter from './converter'

export default function (
  key: string | undefined,
  converter: CookieConverter
): string | object | undefined {
  // To prevent the for loop in the first place assign an empty array
  // in case there are no cookies at all.
  const cookies: string[] =
    document.cookie.length > 0 ? document.cookie.split('; ') : []
  const jar: object & { [property: string]: any } = {}
  for (let i = 0; i < cookies.length; i++) {
    const parts: string[] = cookies[i].split('=')
    let value: string = parts.slice(1).join('=')

    if (value[0] === '"') {
      value = value.slice(1, -1)
    }

    try {
      const foundKey: string = defaultConverter.read(parts[0])
      jar[foundKey] = converter.read(value, foundKey)

      if (key === foundKey) {
        break
      }
    } catch (e) {}
  }

  return key != null ? jar[key] : jar
}
