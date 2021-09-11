/* global expect, test */

import { assert, property, unicode } from 'fast-check'
import { decodeValue, encodeValue } from '../src/codec'

test('name decode/encode round trip', () => {
  assert(
    property(unicode(), (value) =>
      expect(decodeValue(encodeValue(value))).toBe(value)
    ), { numRuns: 1000, verbose: true }
  )
})
