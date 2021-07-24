/* global test, expect */

import get from '../src/get'
import converter from '../src/converter'

// TODO: cleanup cookies after each

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
