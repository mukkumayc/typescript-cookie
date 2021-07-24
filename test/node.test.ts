/* global test, expect */
/* @jest-environment node */

import api from '../src/api'

test('should load the Cookies API', () => {
  expect(api.get).not.toBeUndefined()
  expect(api.set).not.toBeUndefined()
  expect(api.remove).not.toBeUndefined()
})

test('should not throw error when attempting to set cookie', () => {
  expect(() => api.set('foo', 'bar')).not.toThrow()
})

test('should not throw error when attempting to get cookie', () => {
  expect(() => api.get('foo')).not.toThrow()
})

test('should not throw error when attempting to remove cookie', () => {
  expect(() => api.remove('foo')).not.toThrow()
})
