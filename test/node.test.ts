/* global test, expect */
/* @jest-environment node */

import * as api from '../src/api'

test('should load the Cookies API', () => {
  expect(api.getCookie).not.toBeUndefined()
  expect(api.setCookie).not.toBeUndefined()
  expect(api.removeCookie).not.toBeUndefined()
})

test('should not throw error when attempting to set cookie', () => {
  expect(() => api.setCookie('foo', 'bar')).not.toThrow()
})

test('should not throw error when attempting to get cookie', () => {
  expect(() => api.getCookie('foo')).not.toThrow()
})

test('should not throw error when attempting to remove cookie', () => {
  expect(() => api.removeCookie('foo')).not.toThrow()
})
