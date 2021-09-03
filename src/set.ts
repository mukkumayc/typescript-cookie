import { CookieAttributes, Encoder } from '../types/index'

function stringifyAttributes (
  attributes: CookieAttributes & { expires?: any }
): string {
  // Copy incoming attributes as to not alter the original object..
  attributes = Object.assign({}, attributes)

  if (typeof attributes.expires === 'number') {
    attributes.expires = new Date(Date.now() + attributes.expires * 864e5)
  }
  if (attributes.expires != null) {
    attributes.expires = attributes.expires.toUTCString()
  }

  return (
    Object.entries(attributes)
      .filter(([key, value]: [string, any]) => value != null && value !== false)
      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      .map(([key, value]: [string, string | true]) =>
        value === true ? `; ${key}` : `; ${key}=${value.split(';')[0]}`
      )
      .join('')
  )
}

export default function (
  name: string,
  value: any,
  attributes: CookieAttributes & { expires?: any },
  encodeValue: Encoder<any>,
  encodeName: Encoder<string>
): string {
  return (document.cookie = `${encodeName(name)}=${encodeValue(
    value,
    name
  )}${stringifyAttributes(attributes)}`)
}
