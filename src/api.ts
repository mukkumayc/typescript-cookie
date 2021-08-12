import { CookieAttributes, CookieConverter } from '../types/index'
import set from './set'
import get from './get'
import { writeValue as write, readValue as read } from './converter'

export const defaultConverter: CookieConverter = { read, write }

export const defaultAttributes: CookieAttributes = { path: '/' }

export function setCookie (
  key: string,
  value: string | number | boolean,
  attributes?: CookieAttributes
): string | undefined {
  if (typeof document === 'undefined') {
    return
  }

  return set(
    key,
    value as string,
    Object.assign({}, defaultAttributes, attributes)
  )
}

export function getCookie (key?: string): string | object | undefined {
  if (
    typeof document === 'undefined' ||
    (arguments.length > 0 && key == null)
  ) {
    return
  }

  return get(key)
}

export function removeCookie (key: string, attributes?: CookieAttributes): void {
  setCookie(
    key,
    '',
    Object.assign({}, attributes, {
      expires: -1
    })
  )
}
