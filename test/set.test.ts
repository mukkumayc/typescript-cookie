/* global test, expect */

import set from '../src/set'
import { write } from '../src/converter'

test('simple value', () => {
  set('c', 'v', {}, write)
  expect(document.cookie).toBe('c=v')
})
