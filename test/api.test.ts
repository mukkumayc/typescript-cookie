/* global afterEach, describe, expect, test */

import { getCookie, getCookies, removeCookie, setCookie } from '../src/api'

describe('setCookie', () => {
  afterEach(() => {
    // Clean up test cookie!
    document.cookie = 'c=v; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })

  test('when simple value', () => {
    setCookie('c', 'v')
    expect(document.cookie).toBe('c=v')
  })

  test('when value matches "[object Object]"', () => {
    setCookie('c', '[object Object]')
    expect(document.cookie).toBe('c=[object%20Object]')
  })

  test('return value is written cookie string', () => {
    expect(setCookie('c', 'v')).toBe('c=v; path=/')
  })

  describe('with attributes', () => {
    test("won't alter passed attributes object", () => {
      const attributes = { path: '/test' }
      setCookie('c', attributes)
      expect(attributes).toStrictEqual({ path: '/test' })
    })

    test('using predefined default path', () => {
      expect(setCookie('c', 'v')).toMatch(/; path=\/$/)
    })

    test('when undefined path value', () => {
      expect(
        setCookie('c', 'v', {
          path: undefined
        })
      ).toBe('c=v')
    })

    test('when true secure value', () => {
      expect(setCookie('c', 'v', { secure: true })).toMatch(/; secure$/)
    })

    // github.com/js-cookie/js-cookie/pull/54
    test('when false secure value', () => {
      expect(setCookie('c', 'v', { secure: false })).not.toMatch('secure')
    })

    test('when undefined secure value', () => {
      expect(
        setCookie('c', 'v', {
          secure: undefined
        })
      ).toBe('c=v')
    })

    test('when expires as days from now', () => {
      const days = 200
      const expires = new Date(
        new Date().valueOf() + days * 24 * 60 * 60 * 1000
      )
      expect(setCookie('c', 'v', { expires: days })).toMatch(
        `; expires=${expires.toUTCString()}`
      )
    })

    test('when expires as fraction of a day', () => {
      const written = setCookie('c', 'v', { expires: 0.5 }) as string
      const dateMatch = written.match(/expires=(.+)/)
      const stringifiedDate = dateMatch != null ? dateMatch[1] : ''
      const expires = new Date(stringifiedDate)
      const then = new Date(new Date().valueOf() + 12 * 60 * 60 * 1000) // half a day...
      // When we were using Date.setDate() fractions have been ignored
      // and expires resulted in the current date. Allow 1000 milliseconds
      // difference for execution time because new Date() can be different,
      // even when it's run synchronously.
      // See https://github.com/js-cookie/js-cookie/commit/ecb597b65e4c477baa2b30a2a5a67fdaee9870ea#commitcomment-20146048.
      expect(expires.getTime()).toBeLessThanOrEqual(then.getTime())
      expect(expires.getTime()).toBeGreaterThanOrEqual(then.getTime() - 1000)
    })

    test('when expires as Date instance', () => {
      const sevenDaysFromNow = new Date()
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
      expect(setCookie('c', 'v', { expires: sevenDaysFromNow })).toMatch(
        `; expires=${sevenDaysFromNow.toUTCString()}`
      )
    })

    test('when undefined expires value', () => {
      expect(
        setCookie('c', 'v', {
          expires: undefined
        })
      ).toBe('c=v')
    })

    test('when undefined domain value', () => {
      expect(
        setCookie('c', 'v', {
          domain: undefined
        })
      ).toBe('c=v')
    })

    // github.com/js-cookie/js-cookie/issues/276
    test('when arbitrary attribute', () => {
      expect(
        setCookie('c', 'v', {
          arbitrary: 'foo'
        })
      ).toMatch('; arbitrary=foo')
    })

    test('when undefined arbitrary value', () => {
      expect(
        setCookie('c', 'v', {
          arbitrary: undefined
        })
      ).toBe('c=v')
    })

    // github.com/js-cookie/js-cookie/issues/396
    test('sanitizing of attributes to prevent XSS from untrusted input', () => {
      expect(
        setCookie('c', 'v', {
          path: '/;domain=sub.domain.com',
          domain: 'site.com;remove_this',
          customAttribute: 'value;;remove_this'
        })
      ).toBe('c=v; path=/; domain=site.com; customAttribute=value')
    })
  })
})

describe('getCookie', () => {
  afterEach(() => {
    // Clean up test cookie!
    document.cookie = 'c=v; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })

  test('when simple value', () => {
    document.cookie = 'c=v'
    expect(getCookie('c')).toBe('v')
  })

  test('when not existing', () => {
    expect(getCookie('whatever')).toBeUndefined()
  })

  // github.com/carhartl/jquery-cookie/issues/50
  test('when equality sign in cookie value', () => {
    document.cookie = 'c=foo=bar'
    expect(getCookie('c')).toBe('foo=bar')
  })

  // github.com/carhartl/jquery-cookie/issues/215
  test('when percent character in cookie value', () => {
    document.cookie = 'c=foo%'
    expect(getCookie('c')).toBe('foo%')
  })

  test('when unencoded percent character in cookie value mixed with encoded values not permitted', () => {
    document.cookie = 'c=foo%bar%22baz%qux'
    expect(getCookie('bad')).toBeUndefined()
  })

  test('when lowercase percent character in cookie value', () => {
    document.cookie = 'c=%d0%96'
    expect(getCookie('c')).toBe('Ж')
  })

  test('when cookie-octet enclosed in DQUOTE (RFC 6265)', () => {
    document.cookie = 'c="v"'
    expect(getCookie('c')).toBe('v')
  })

  // github.com/js-cookie/js-cookie/issues/196
  test('when there is another unrelated cookie with malformed encoding in the name', () => {
    document.cookie = '%A1=foo'
    document.cookie = 'c=v'
    expect(() => getCookie('c')).not.toThrow()
    document.cookie = '%A1=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })

  // github.com/js-cookie/js-cookie/pull/62
  test('when there is another unrelated cookie with malformed encoding in the value', () => {
    document.cookie = 'invalid=%A1'
    document.cookie = 'c=v'
    expect(() => getCookie('c')).not.toThrow()
    document.cookie = 'invalid=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })

  test('with custom read converter', () => {
    document.cookie = 'c=v'
    expect(getCookie('c', (value) => value.toUpperCase())).toBe('V')
  })
})

describe('getCookies', () => {
  afterEach(() => {
    // Clean up test cookie!
    document.cookie = 'c=v; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })

  test('when there are cookies', () => {
    document.cookie = 'one=foo'
    document.cookie = 'two=bar'
    expect(getCookies()).toStrictEqual({ one: 'foo', two: 'bar' })
    document.cookie = 'one=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'two=bar; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })

  test('when there are no cookies yet', () => {
    expect(getCookies()).toStrictEqual({})
  })

  // github.com/js-cookie/js-cookie/issues/196
  test('when there is a cookie with malformed encoding in the name', () => {
    document.cookie = '%A1=foo'
    document.cookie = 'c=v'
    expect(() => getCookies()).not.toThrow()
    document.cookie = '%A1=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })

  // github.com/js-cookie/js-cookie/pull/62
  test('when there is a cookie with malformed encoding in the value', () => {
    document.cookie = 'invalid=%A1'
    document.cookie = 'c=v'
    expect(() => getCookies()).not.toThrow()
    document.cookie = 'invalid=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  })
})

describe('removeCookie', () => {
  test('erases given cookie', () => {
    document.cookie = 'c=v; path=/'
    removeCookie('c')
    expect(document.cookie).toBe('')
  })

  describe('with attributes', () => {
    test("won't alter passed attributes object", () => {
      const attributes = { path: '/test' }
      removeCookie('c', attributes)
      expect(attributes).toStrictEqual({ path: '/test' })
    })

    test('using predefined default path', () => {
      document.cookie = 'c=v; path=/'
      removeCookie('c')
      expect(document.cookie).toBe('')
    })

    test('with particular path', () => {
      document.cookie = 'c=v; path=/'
      removeCookie('c', { path: '/test' })
      expect(document.cookie).toBe('c=v')
      removeCookie('c', { path: '/' })
      expect(document.cookie).toBe('')
    })
  })
})
