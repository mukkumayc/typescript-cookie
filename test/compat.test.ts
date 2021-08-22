/* global test, expect */

import Cookies from '../src/compat'

describe('set', () => {
  afterEach(() => {
    // Clean up test cookie!
    document.cookie = 'c=v; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })

  test('merges default attributes with given attributes', () => {
    expect(Cookies.set('c', 'v', { sameSite: 'Lax' })).toBe(
      'c=v; path=/; sameSite=Lax'
    )
  })
})

describe('get', () => {
  test("when `undefined` as first argument won't attempt to retrieve all cookies", () => {
    expect(Cookies.get(undefined)).toBeUndefined()
  })

  test("when `null` as first argument won't attempt to retrieve all cookies", () => {
    expect(Cookies.get(null)).toBeUndefined()
  })
})

describe('configuration', () => {
  afterEach(() => {
    // Clean up test cookie!
    document.cookie = 'c=v; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })

  describe('withAttributes', () => {
    test('sets up instance with new default cookie attributes', () => {
      const api = Cookies.withAttributes({ path: '/bar' })
      expect(api.attributes).toStrictEqual({ path: '/bar' })
      expect(api.set('c', 'v')).toBe('c=v; path=/bar')
    })

    test('sets up cookie attributes each time from original', () => {
      Cookies.withAttributes({ path: '/bar' })
      const api = Cookies.withAttributes({ sameSite: 'Lax' })
      expect(api.attributes).toStrictEqual({ path: '/', sameSite: 'Lax' })
      expect(api.set('c', 'v')).not.toMatch('path=/bar')
    })
  })

  describe('withConverter', () => {
    // github.com/js-cookie/js-cookie/issues/70
    test('setting up custom write decoder', () => {
      Cookies.withConverter({
        write: (value) => value.replace('+', '%2B')
      }).set('c', '+')
      expect(document.cookie).toMatch('c=%2B')
    })

    test('setting up custom read decoder', () => {
      document.cookie = 'c=%2B'
      expect(
        Cookies.withConverter({
          read: (value) => value.replace('%2B', '+')
        }).get('c')
      ).toBe('+')
    })
  })

  test('with attributes argument having precedence', () => {
    const api = Cookies.withAttributes({ path: '/foo' })
    expect(api.set('c', 'v', { path: '/' })).toBe('c=v; path=/')
  })

  test('setting up converters followed by default cookie attributes', () => {
    const api = Cookies.withConverter({
      write: (value) => value.toUpperCase()
    }).withAttributes({ path: '/foo' })
    expect(api.set('c', 'v')).toMatch(/c=V; path=\/foo/)
  })

  test('setting up default cookie attributes followed by converter', () => {
    const api = Cookies.withAttributes({ path: '/foo' }).withConverter({
      write: (value) => value.toUpperCase()
    })
    expect(api.set('c', 'v')).toMatch(/c=V; path=\/foo/)
  })
})
