import {
  CookieAttributes,
  CookieConverter,
  WriteConverter,
  ReadConverter
} from '../types/index'
import set from './set'
import get from './get'
import { writeValue as write, readValue as read } from './converter'

export const defaultConverter: CookieConverter = { read, write }

export const defaultAttributes: CookieAttributes = { path: '/' }

export function setCookie (
  key: string,
  value: string | number | boolean,
  attributes: CookieAttributes = defaultAttributes,
  converter: WriteConverter = write
): string | undefined {
  if (typeof document === 'undefined') {
    return
  }

  return set(key, value as string, Object.assign({}, attributes), converter)
}

export function getCookie (
  key: string,
  converter: ReadConverter = read
): string | undefined {
  if (typeof document === 'undefined') {
    return
  }

  return get(key, converter)
}

export function getCookies (
  converter: ReadConverter = read
): (object & { [property: string]: string }) | undefined {
  if (typeof document === 'undefined') {
    return
  }

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
