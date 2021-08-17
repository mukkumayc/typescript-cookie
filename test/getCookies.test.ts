/* global test, expect, afterEach */

import { getCookies } from '../src/api'

afterEach(() => {
  // Clean up test cookie!
  document.cookie = 'c=v; expires=Thu, 01 Jan 1970 00:00:00 GMT'
})

test('read all cookies when there are cookies', () => {
  document.cookie = 'one=foo'
  document.cookie = 'two=bar'
  expect(getCookies()).toStrictEqual({ one: 'foo', two: 'bar' })
  document.cookie = 'one=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  document.cookie = 'two=bar; expires=Thu, 01 Jan 1970 00:00:00 GMT'
})

test('read all cookies when there are no cookies yet', () => {
  expect(getCookies()).toStrictEqual({})
})

// github.com/js-cookie/js-cookie/issues/196
test('read all cookies when there is a cookie with malformed encoding in the name', () => {
  document.cookie = '%A1=foo'
  document.cookie = 'c=v'
  expect(() => getCookies()).not.toThrow()
  document.cookie = '%A1=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
})

// github.com/js-cookie/js-cookie/pull/62
test('read all cookies when there is a cookie with malformed encoding in the value', () => {
  document.cookie = 'invalid=%A1'
  document.cookie = 'c=v'
  expect(() => getCookies()).not.toThrow()
  document.cookie = 'invalid=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
})
