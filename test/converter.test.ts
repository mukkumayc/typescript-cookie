/* global describe, expect, test */

import { readName, readValue, writeName, writeValue } from '../src/converter'

const NAME_DISALLOWED_CHARS_INPUT_OUTPUT: any = {
  '(': '%28',
  ')': '%29',
  '<': '%3C',
  '>': '%3E',
  '@': '%40',
  ',': '%2C',
  ';': '%3B',
  ':': '%3A',
  '\\': '%5C',
  '"': '%22',
  '/': '%2F',
  '[': '%5B',
  ']': '%5D',
  '?': '%3F',
  '=': '%3D',
  '{': '%7B',
  '}': '%7D',
  ' ': '%20',
  '\t': '%09'
}

const VALUE_DISALLOWED_CHARS_INPUT_OUTPUT: any = {
  ' ': '%20',
  '"': '%22',
  ',': '%2C',
  ';': '%3B',
  '\\': '%5C'
}

describe('writeName', () => {
  describe('RFC 6265 compliance', () => {
    test('with disallowed character in cookie name (token)', () => {
      for (const input in NAME_DISALLOWED_CHARS_INPUT_OUTPUT) {
        expect(writeName(input)).toBe(NAME_DISALLOWED_CHARS_INPUT_OUTPUT[input])
      }
    })

    test('with more than one disallowed character in cookie name', () => {
      expect(writeName('(())')).toBe('%28%28%29%29')
    })
  })
})

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

  describe('RFC 6265 compliance', () => {
    test('with disallowed character in cookie value (cookie-octet)', () => {
      for (const input in VALUE_DISALLOWED_CHARS_INPUT_OUTPUT) {
        expect(writeValue(input)).toBe(
          VALUE_DISALLOWED_CHARS_INPUT_OUTPUT[input]
        )
      }
    })

    test('with more than one disallowed character in cookie value', () => {
      expect(writeValue(';;')).toBe('%3B%3B')
    })
  })
})

describe('readName', () => {
  describe('RFC 6265 compliance', () => {
    test('with disallowed character in cookie name (token)', () => {
      for (const input in NAME_DISALLOWED_CHARS_INPUT_OUTPUT) {
        expect(readName(NAME_DISALLOWED_CHARS_INPUT_OUTPUT[input])).toBe(input)
      }
    })
  })
})

describe('readValue', () => {
  // github.com/carhartl/jquery-cookie/issues/215
  test('when percent character in cookie value', () => {
    expect(readValue('foo%')).toBe('foo%')
  })

  test('when lowercase percent character in cookie value', () => {
    expect(readValue('%d0%96')).toBe('Ж')
  })

  describe('RFC 6265 compliance', () => {
    test('when value (cookie-octet) enclosed in DQUOTE', () => {
      expect(readValue('"v"')).toBe('v')
    })

    test('with disallowed, encoded character in cookie value', () => {
      for (const input in VALUE_DISALLOWED_CHARS_INPUT_OUTPUT) {
        expect(readValue(VALUE_DISALLOWED_CHARS_INPUT_OUTPUT[input])).toBe(
          input
        )
      }
    })

    test('with more than one disallowed, encoded character in cookie value', () => {
      expect(readValue('%3B%3B')).toBe(';;')
    })
  })
})
