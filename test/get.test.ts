/* global test, expect, afterEach */

import get from '../src/get'
import { readValue as read } from '../src/converter'

afterEach(() => {
  // Clean up test cookie!
  document.cookie = 'c=v; expires=Thu, 01 Jan 1970 00:00:00 GMT'
})

test('simple value', () => {
  document.cookie = 'c=v'
  expect(get('c', read)).toBe('v')
})

test('not existing', () => {
  expect(get('whatever', read)).toBeUndefined()
})

test('equality sign in cookie value', () => {
  document.cookie = 'c=foo=bar'
  expect(get('c', read)).toBe('foo=bar')
})

// github.com/carhartl/jquery-cookie/issues/215
test('percent character in cookie value', () => {
  document.cookie = 'c=foo%'
  expect(get('c', read)).toBe('foo%')
})

test('unencoded percent character in cookie value mixed with encoded values not permitted', () => {
  document.cookie = 'c=foo%bar%22baz%qux'
  expect(get('bad', read)).toBeUndefined()
})

test('lowercase percent character in cookie value', () => {
  document.cookie = 'c=%d0%96'
  expect(get('c', read)).toBe('Ж')
})
