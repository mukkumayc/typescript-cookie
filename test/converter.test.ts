/* global describe, expect, test */

import { writeValue, readValue } from '../src/converter'

describe('writeValue', () => {
  test('when number value', () => {
    expect(writeValue(1234)).toBe('1234')
  })

  test('when boolean value', () => {
    expect(writeValue(true)).toBe('true')
  })

  test('when null value', () => {
    expect(writeValue(null)).toBe('null')
  })

  test('when undefined value', () => {
    expect(writeValue(undefined)).toBe('undefined')
  })
})

describe('readValue', () => {
  describe('RFC 6265', () => {
    test('when cookie-octet enclosed in DQUOTE', () => {
      expect(readValue('"v"')).toBe('v')
    })
  })
})
