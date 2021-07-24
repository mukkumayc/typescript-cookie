/* global test, expect, afterEach */

import get from '../src/get'
import converter from '../src/converter'

afterEach(() => {
  // Clean up test cookie!
  document.cookie = 'c=v; expires=Thu, 01 Jan 1970 00:00:00 GMT'
})

test('simple value', () => {
  document.cookie = 'c=v'
  expect(get('c', converter)).toBe('v')
})

test('not existing', () => {
  expect(get('whatever', converter)).toBeUndefined()
})

test('equality sign in cookie value', () => {
  document.cookie = 'c=foo=bar'
  expect(get('c', converter)).toBe('foo=bar')
})
