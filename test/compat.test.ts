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

test("won't allow to reassign property within attributes property", () => {
  try {
    // throws TypeError in strict mode (ES module)
    Cookies.attributes.path = '/foo'
  } catch (error) {}
  expect(Cookies.attributes.path).toEqual('/')
})

test("won't allow to reassign property within converter property", () => {
  const newReadConverter = (value: string): string => ''
  try {
    // throws TypeError in strict mode (ES module)
    Cookies.converter.read = newReadConverter
  } catch (error) {}
  expect(Cookies.converter.read).not.toBe(newReadConverter)
})

test("get with `undefined` as first argument won't attempt to retrieve all cookies", () => {
  expect(Cookies.get(undefined)).toBeUndefined()
})

test("get with `null` as first argument won't attempt to retrieve all cookies", () => {
  expect(Cookies.get(null)).toBeUndefined()
})
