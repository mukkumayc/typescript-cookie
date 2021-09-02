import {
  CookieAttributes,
  CookieAttributesConfig,
  CookieConverterConfig,
  ReadConverter,
  WriteConverter
} from '../types/index'
import set from './set'
import get from './get'
import {
  readName as defaultNameDecoder,
  readValue as defaultValueDecoder,
  writeName as defaultNameEncoder,
  writeValue as defaultValueEncoder
} from './converter'

export const defaultConverter: CookieConverterConfig<
string | number | boolean | undefined | null,
string
> = {
  write: defaultValueEncoder,
  read: defaultValueDecoder
}

export const defaultAttributes: CookieAttributesConfig = { path: '/' }

export function setCookie (
  key: string,
  value: any,
  attributes: CookieAttributes = defaultAttributes,
  {
    encodeValue = defaultValueEncoder,
    encodeName = defaultNameEncoder
  }: {
    encodeValue?: WriteConverter<any>
    encodeName?: WriteConverter<string>
  } = {}
): string {
  return set(key, value, attributes, encodeValue, encodeName)
}

export function getCookie (
  key: string,
  {
    decodeValue = defaultValueDecoder,
    decodeName = defaultNameDecoder
  }: {
    decodeValue?: ReadConverter<any>
    decodeName?: ReadConverter<string>
  } = {}
): ReturnType<typeof decodeValue> | undefined {
  return get(key, decodeValue, decodeName)
}

export function getCookies ({
  decodeValue = defaultValueDecoder,
  decodeName = defaultNameDecoder
}: {
  decodeValue?: ReadConverter<any>
  decodeName?: ReadConverter<string>
} = {}): object & { [property: string]: ReturnType<typeof decodeValue> } {
  return get(undefined, decodeValue, decodeName)
}

export function removeCookie (
  key: string,
  attributes: CookieAttributes = defaultAttributes
): void {
  setCookie(
    key,
    '',
    Object.assign({}, attributes, {
      expires: -1
    })
  )
}
