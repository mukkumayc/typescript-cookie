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

  return stringifiedAttributes
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
