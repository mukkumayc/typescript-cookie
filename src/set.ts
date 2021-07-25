import { WriteConverter } from '../types/index'

export default function (
  key: string,
  value: string,
  attributes: object & { [property: string]: any },
  converter: WriteConverter
): string {
  key = encodeURIComponent(key)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape)

  value = converter(value, key)

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

  return (document.cookie = `${key}=${value}${stringifiedAttributes}`)
}
