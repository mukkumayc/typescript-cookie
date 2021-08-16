/* global test, expect */

import Cookies from '../src/compat'

test('setting up instance with default cookie attributes', () => {
  const api = Cookies.withAttributes({ path: '/bar' })
  expect(api.set('c', 'v')).toMatch(/c=v; path=\/bar/)
})

test('setting up cookie attributes each time from original', () => {
  Cookies.withAttributes({ path: '/bar' })
  const second = Cookies.withAttributes({ sameSite: 'Lax' })
  expect(second.set('c', 'v')).not.toMatch(/c=v; path=\/bar/)
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
