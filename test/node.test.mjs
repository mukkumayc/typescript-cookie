/* global test, expect */
/* @jest-environment node */

import Cookies from '../dist/js.cookie.mjs'

test('should load the Cookies API', () => {
  expect(Cookies.get).not.toBeUndefined()
  expect(Cookies.set).not.toBeUndefined()
  expect(Cookies.remove).not.toBeUndefined()
})

test('should not throw error when attempting to set cookie', () => {
  expect(() => Cookies.set('foo')).not.toThrow()
})

test('should not throw error when attempting to get cookie', () => {
  expect(() => Cookies.get('foo')).not.toThrow()
})

test('should not throw error when attempting to remove cookie', () => {
  expect(() => Cookies.remove('foo')).not.toThrow()
})
