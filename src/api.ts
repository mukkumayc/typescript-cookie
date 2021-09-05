import {
  CookieAttributes,
  CookieAttributesConfig,
  CookieCodecConfig,
  CookieDecoding,
  CookieEncoding,
  Decoder
} from '../types/index'
import {
  decodeName as defaultNameDecoder,
  decodeValue as defaultValueDecoder,
  encodeName as defaultNameEncoder,
  encodeValue as defaultValueEncoder
} from './codec'

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

type GetReturn<T, R> = [T] extends [undefined]
  ? { [property: string]: string }
  : R | undefined

function get<T extends string | undefined> (
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
      jar[found] = decodeValue(match[2], found)
      if (name === found) {
        break
      }
    } catch (e) {}
  }

  return name != null ? jar[name] : jar
}

export const DEFAULT_CODEC: CookieCodecConfig<
string | number | boolean | undefined | null,
string
> = Object.freeze({
  decodeName: defaultNameDecoder,
  decodeValue: defaultValueDecoder,
  encodeName: defaultNameEncoder,
  encodeValue: defaultValueEncoder
})

export const DEFAULT_ATTRIBUTES: CookieAttributesConfig = Object.freeze({
  path: '/'
})

export function setCookie (
  name: string,
  value: any,
  attributes: CookieAttributes = DEFAULT_ATTRIBUTES,
  {
    encodeValue = defaultValueEncoder,
    encodeName = defaultNameEncoder
  }: CookieEncoding<any> = {}
): string {
  return (document.cookie = `${encodeName(name)}=${encodeValue(
    value,
    name
  )}${stringifyAttributes(attributes)}`)
}

export function getCookie (
  name: string,
  {
    decodeValue = defaultValueDecoder,
    decodeName = defaultNameDecoder
  }: CookieDecoding<any> = {}
): ReturnType<typeof decodeValue> | undefined {
  return get(name, decodeValue, decodeName)
}

export function getCookies ({
  decodeValue = defaultValueDecoder,
  decodeName = defaultNameDecoder
}: CookieDecoding<any> = {}): {
    [property: string]: ReturnType<typeof decodeValue>
  } {
  return get(undefined, decodeValue, decodeName)
}

export function removeCookie (
  name: string,
  attributes: CookieAttributes = DEFAULT_ATTRIBUTES
): void {
  setCookie(
    name,
    '',
    Object.assign({}, attributes, {
      expires: -1
    })
  )
}
