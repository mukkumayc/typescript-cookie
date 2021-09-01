import {
  CookieAttributes,
  CookieAttributesConfig,
  CookieConverterConfig,
  ReadConverter,
  WriteConverter
} from '../types/index'
import set from './set'
import get from './get'
import { writeValue as write, readValue as read } from './converter'

export const defaultConverter: CookieConverterConfig<
string | number | boolean | undefined | null,
string
> = {
  write,
  read
}

export const defaultAttributes: CookieAttributesConfig = { path: '/' }

export function setCookie (
  key: string,
  value: any,
  attributes: CookieAttributes = defaultAttributes,
  converter: WriteConverter<any> = write
): string {
  return set(key, value, attributes, converter)
}

export function getCookie (
  key: string,
  converter: ReadConverter<any> = read
): ReturnType<typeof converter> | undefined {
  return get(key, converter)
}

export function getCookies (
  converter: ReadConverter<string> = read
): object & { [property: string]: ReturnType<typeof converter> } {
  return get(undefined, converter)
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
