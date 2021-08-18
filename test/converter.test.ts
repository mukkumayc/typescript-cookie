/* global describe, expect, test */

import { writeValue } from '../src/converter'

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
