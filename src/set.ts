import { CookieAttributes, WriteConverter } from '../types/index'
import { writeValue } from './converter'

export default function (
  key: string,
  value: any,
  attributes: CookieAttributes & { expires?: any },
  converter: WriteConverter = writeValue
): string {
  key = encodeURIComponent(key)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape)

  // Copy incoming attributes as to not alter the original object..
  attributes = Object.assign({}, attributes)

  if (typeof attributes.expires === 'number') {
    attributes.expires = new Date(Date.now() + attributes.expires * 864e5)
  }
  if (attributes.expires != null) {
    attributes.expires = attributes.expires.toUTCString()
  }

  let stringifiedAttributes: string = ''
  for (const attributeName in attributes) {
    if (
      attributes[attributeName] == null ||
      attributes[attributeName] === false
    ) {
      continue
    }

    stringifiedAttributes += `; ${attributeName}`

    if (attributes[attributeName] === true) {
      continue
    }

    // Considers RFC 6265 section 5.2:
    // ...
    // 3.  If the remaining unparsed-attributes contains a %x3B (";")
    //     character:
    // Consume the characters of the unparsed-attributes up to,
    // not including, the first %x3B (";") character.
    // ...
    const attributeValue: string = attributes[attributeName].split(';')[0]
    stringifiedAttributes += `=${attributeValue}`
  }

  return (document.cookie = `${key}=${converter(
    value,
    key
  )}${stringifiedAttributes}`)
}
