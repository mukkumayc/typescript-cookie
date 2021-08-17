/* global test, expect, afterEach */

import { getCookie } from '../src/api'

afterEach(() => {
  // Clean up test cookie!
  document.cookie = 'c=v; expires=Thu, 01 Jan 1970 00:00:00 GMT'
})

test('simple value', () => {
  document.cookie = 'c=v'
  expect(getCookie('c')).toBe('v')
})

test('not existing', () => {
  expect(getCookie('whatever')).toBeUndefined()
})

// github.com/carhartl/jquery-cookie/issues/50
test('equality sign in cookie value', () => {
  document.cookie = 'c=foo=bar'
  expect(getCookie('c')).toBe('foo=bar')
})

// github.com/carhartl/jquery-cookie/issues/215
test('percent character in cookie value', () => {
  document.cookie = 'c=foo%'
  expect(getCookie('c')).toBe('foo%')
})

test('unencoded percent character in cookie value mixed with encoded values not permitted', () => {
  document.cookie = 'c=foo%bar%22baz%qux'
  expect(getCookie('bad')).toBeUndefined()
})

test('lowercase percent character in cookie value', () => {
  document.cookie = 'c=%d0%96'
  expect(getCookie('c')).toBe('Ж')
})

test('read cookie-octet enclosed in DQUOTE (RFC 6265)', () => {
  document.cookie = 'c="v"'
  expect(getCookie('c')).toBe('v')
})

// github.com/js-cookie/js-cookie/issues/196
test('read cookie when there is another unrelated cookie with malformed encoding in the name', () => {
  document.cookie = '%A1=foo'
  document.cookie = 'c=v'
  expect(() => getCookie('c')).not.toThrow()
  document.cookie = '%A1=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
})

// github.com/js-cookie/js-cookie/pull/62
test('read cookie when there is another unrelated cookie with malformed encoding in the value', () => {
  document.cookie = 'invalid=%A1'
  document.cookie = 'c=v'
  expect(() => getCookie('c')).not.toThrow()
  document.cookie = 'invalid=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
})

test('custom read converter', () => {
  document.cookie = 'c=v'
  expect(getCookie('c', (value) => value.toUpperCase())).toBe('V')
})
