/* global test, expect, afterEach */

import get from '../src/get'
import { read } from '../src/converter'

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
