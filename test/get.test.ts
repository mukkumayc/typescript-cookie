/* global test, expect, afterEach */

import get from '../src/get'

afterEach(() => {
  // Clean up test cookie!
  document.cookie = 'c=v; expires=Thu, 01 Jan 1970 00:00:00 GMT'
})

test('simple value', () => {
  document.cookie = 'c=v'
  expect(get('c')).toBe('v')
})

test('not existing', () => {
  expect(get('whatever')).toBeUndefined()
})

// github.com/carhartl/jquery-cookie/issues/50
test('equality sign in cookie value', () => {
  document.cookie = 'c=foo=bar'
  expect(get('c')).toBe('foo=bar')
})

// github.com/carhartl/jquery-cookie/issues/215
test('percent character in cookie value', () => {
  document.cookie = 'c=foo%'
  expect(get('c')).toBe('foo%')
})

test('unencoded percent character in cookie value mixed with encoded values not permitted', () => {
  document.cookie = 'c=foo%bar%22baz%qux'
  expect(get('bad')).toBeUndefined()
})

test('lowercase percent character in cookie value', () => {
  document.cookie = 'c=%d0%96'
  expect(get('c')).toBe('Ж')
})

test('read all cookies when there are cookies', () => {
  document.cookie = 'one=foo'
  document.cookie = 'two=bar'
  expect(get(undefined)).toStrictEqual({ one: 'foo', two: 'bar' })
  document.cookie = 'one=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  document.cookie = 'two=bar; expires=Thu, 01 Jan 1970 00:00:00 GMT'
})

test('read all cookies when there are no cookies yet', () => {
  expect(get(undefined)).toStrictEqual({})
})

test('read cookie-octet enclosed in DQUOTE (RFC 6265)', () => {
  document.cookie = 'c="v"'
  expect(get('c')).toBe('v')
})

// github.com/js-cookie/js-cookie/issues/196
test('read cookie when there is another unrelated cookie with malformed encoding in the name', () => {
  document.cookie = '%A1=foo'
  document.cookie = 'c=v'
  expect(() => get('c')).not.toThrow()
  expect(() => get(undefined)).not.toThrow()
  document.cookie = '%A1=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
})

// github.com/js-cookie/js-cookie/pull/62
test('read cookie when there is another unrelated cookie with malformed encoding in the value', () => {
  document.cookie = 'invalid=%A1'
  document.cookie = 'c=v'
  expect(() => get('c')).not.toThrow()
  expect(() => get(undefined)).not.toThrow()
  document.cookie = 'invalid=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
})

test('custom read converter', () => {
  document.cookie = 'c=v'
  expect(get('c', (value) => value.toUpperCase())).toBe('V')
})
