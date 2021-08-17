/* global test, expect */

import { setCookie } from '../src/api'

test('simple value', () => {
  setCookie('c', 'v')
  expect(document.cookie).toBe('c=v')
})
