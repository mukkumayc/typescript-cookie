/* global afterEach, describe, expect, test */

import { getCookie, getCookies, setCookie } from '../src/api'

describe('setCookie', () => {
  test('when simple value', () => {
    setCookie('c', 'v')
    expect(document.cookie).toBe('c=v')
  })
})

describe('getCookie', () => {
  afterEach(() => {
    // Clean up test cookie!
    document.cookie = 'c=v; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })

  test('when simple value', () => {
    document.cookie = 'c=v'
    expect(getCookie('c')).toBe('v')
  })

  test('when not existing', () => {
    expect(getCookie('whatever')).toBeUndefined()
  })

  // github.com/carhartl/jquery-cookie/issues/50
  test('when equality sign in cookie value', () => {
    document.cookie = 'c=foo=bar'
    expect(getCookie('c')).toBe('foo=bar')
  })

  // github.com/carhartl/jquery-cookie/issues/215
  test('when percent character in cookie value', () => {
    document.cookie = 'c=foo%'
    expect(getCookie('c')).toBe('foo%')
  })

  test('when unencoded percent character in cookie value mixed with encoded values not permitted', () => {
    document.cookie = 'c=foo%bar%22baz%qux'
    expect(getCookie('bad')).toBeUndefined()
  })

  test('when lowercase percent character in cookie value', () => {
    document.cookie = 'c=%d0%96'
    expect(getCookie('c')).toBe('Ж')
  })

  test('when cookie-octet enclosed in DQUOTE (RFC 6265)', () => {
    document.cookie = 'c="v"'
    expect(getCookie('c')).toBe('v')
  })

  // github.com/js-cookie/js-cookie/issues/196
  test('when there is another unrelated cookie with malformed encoding in the name', () => {
    document.cookie = '%A1=foo'
    document.cookie = 'c=v'
    expect(() => getCookie('c')).not.toThrow()
    document.cookie = '%A1=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })

  // github.com/js-cookie/js-cookie/pull/62
  test('when there is another unrelated cookie with malformed encoding in the value', () => {
    document.cookie = 'invalid=%A1'
    document.cookie = 'c=v'
    expect(() => getCookie('c')).not.toThrow()
    document.cookie = 'invalid=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })

  test('with custom read converter', () => {
    document.cookie = 'c=v'
    expect(getCookie('c', (value) => value.toUpperCase())).toBe('V')
  })
})

describe('getCookies', () => {
  afterEach(() => {
    // Clean up test cookie!
    document.cookie = 'c=v; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })

  test('when there are cookies', () => {
    document.cookie = 'one=foo'
    document.cookie = 'two=bar'
    expect(getCookies()).toStrictEqual({ one: 'foo', two: 'bar' })
    document.cookie = 'one=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'two=bar; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })

  test('when there are no cookies yet', () => {
    expect(getCookies()).toStrictEqual({})
  })

  // github.com/js-cookie/js-cookie/issues/196
  test('when there is a cookie with malformed encoding in the name', () => {
    document.cookie = '%A1=foo'
    document.cookie = 'c=v'
    expect(() => getCookies()).not.toThrow()
    document.cookie = '%A1=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })

  // github.com/js-cookie/js-cookie/pull/62
  test('when there is a cookie with malformed encoding in the value', () => {
    document.cookie = 'invalid=%A1'
    document.cookie = 'c=v'
    expect(() => getCookies()).not.toThrow()
    document.cookie = 'invalid=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })
})
