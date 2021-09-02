# TypeScript Cookie [![CI Status](https://github.com/carhartl/ts-cookie/actions/workflows/ci.yml/badge.svg)](https://github.com/carhartl/ts-cookie/actions/workflows/ci.yml) [![BrowserStack Test](https://github.com/carhartl/ts-cookie/actions/workflows/browserstack.yml/badge.svg)](https://github.com/carhartl/ts-cookie/actions/workflows/browserstack.yml) [![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=SnFLWWhWbGRVQkFlVkZ1OHhGd01YdTVCK1Nlbnd6aExBbGlscGhoVDdycz0tLWxUNmpGMkhBd1Bta1JYU1dUbGU2WGc9PQ==--f6bcbe4c1c193e877eea44fd5a5e8508cc3b51ea)](https://www.browserstack.com/automate/public-build/b3VDaHAxVDg0NDdCRmtUOWg0SlQzK2NsRVhWTjlDQS9qdGJoak1GMzJiVT0tLVhwZHNvdGRoY284YVRrRnI3eU1JTnc9PQ==--5e88ffb3ca116001d7ef2cfb97a4128ac31174c2) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Maintainability](https://api.codeclimate.com/v1/badges/4865e88ab62e2d60842e/maintainability)](https://codeclimate.com/github/carhartl/ts-cookie/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/4865e88ab62e2d60842e/test_coverage)](https://codeclimate.com/github/carhartl/ts-cookie/test_coverage) [![npm](https://img.shields.io/github/package-json/v/ts-cookie/ts-cookie)](https://www.npmjs.com/package/ts-cookie) [![size](https://img.shields.io/bundlephobia/minzip/ts-cookie/rc)](https://www.npmjs.com/package/ts-cookie) [![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/ts-cookie/badge?style=rounded)](https://www.jsdelivr.com/package/npm/ts-cookie)

A simple, lightweight TypeScript API for handling cookies.

## Goals/Features

- Full TypeScript support
- Support for ES modules only
- Tree-shakable
- No dependencies
- [RFC 6265](https://tools.ietf.org/html/rfc6265) compliant
- Enable [custom encoding/decoding](#codec)
- Think: [js-cookie](https://github.com/js-cookie/js-cookie) 4.0
- **< 700 bytes** gzipped!

**👉👉 If you're viewing this at https://github.com/ts-cookie/ts-cookie, you're reading the documentation for the master branch.
[View documentation for the latest release.](https://github.com/ts-cookie/ts-cookie/tree/latest#readme) 👈👈**

## Installation

### NPM

```
$ npm i ts-cookie
```

## Basic Usage

Importing setter:

```javascript
import { setCookie } from 'ts-cookie'
```

All other functions not being used can be tree-shaken by a bundler.

Importing all:

```javascript
import { getCookie, removeCookie, setCookie } from 'ts-cookie'
```

Create a cookie, valid across the entire site:

```javascript
setCookie('name', 'value')
```

Create a cookie that expires 7 days from now, valid across the entire site:

```javascript
setCookie('name', 'value', { expires: 7 })
```

Create an expiring cookie, valid to the path of the current page:

```javascript
setCookie('name', 'value', { expires: 7, path: '' })
```

Read cookie:

```javascript
getCookie('name') // => 'value'
getCookie('nothing') // => undefined
```

Read all visible cookies:

```javascript
getCookies() // => { name: 'value' }
```

_Note: It is not possible to read a particular cookie by passing one of the cookie attributes (which may or may not
have been used when writing the cookie in question):_

```javascript
getCookie('foo', { domain: 'sub.example.com' }) // `domain` won't have any effect...!
```

The cookie with the name `foo` will only be available on `.get()` if it's visible from where the
code is called; the domain and/or path attribute will not have an effect when reading.

Delete cookie:

```javascript
removeCookie('name')
```

Delete a cookie valid to the path of the current page:

```javascript
setCookie('name', 'value', { path: '' })
removeCookie('name') // fail!
removeCookie('name', { path: '' }) // removed!
```

_IMPORTANT! When deleting a cookie and you're not relying on the [default attributes](#cookie-attributes), you must pass the exact same path and domain attributes that were used to set the cookie:_

```javascript
removeCookie('name', { path: '', domain: '.yourdomain.com' })
```

_Note: Removing a nonexistent cookie neither raises any exception nor returns any value._

## Encoding

This project is [RFC 6265](http://tools.ietf.org/html/rfc6265#section-4.1.1) compliant. All special characters that are not allowed in the cookie-name or cookie-value are encoded with each one's UTF-8 Hex equivalent using [percent-encoding](http://en.wikipedia.org/wiki/Percent-encoding).  
The only character in cookie-name or cookie-value that is allowed and still encoded is the percent `%` character, it is escaped in order to interpret percent input as literal.  
Please note that the default encoding/decoding strategy is meant to be interoperable [only between cookies that are read/written by ts-cookie](https://github.com/ts-cookie/ts-cookie/pull/200#discussion_r63270778). It's possible to [override the default encoding/decoding strategy](#codec).

_Note: According to [RFC 6265](https://tools.ietf.org/html/rfc6265#section-6.1), your cookies may get deleted if they are too big or there are too many cookies in the same domain, [more details here](https://github.com/ts-cookie/ts-cookie/wiki/Frequently-Asked-Questions#why-are-my-cookies-being-deleted)._

## Cookie Attributes

### expires

Define when the cookie will be removed. Value must be a [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) which will be interpreted as days from time of creation or a [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) instance. If omitted, the cookie becomes a session cookie.

To create a cookie that expires in less than a day, you can check the [FAQ on the Wiki](https://github.com/ts-cookie/ts-cookie/wiki/Frequently-Asked-Questions#expire-cookies-in-less-than-a-day).

**Default:** Cookie is removed when the user closes the browser.

**Examples:**

```javascript
setCookie('name', 'value', { expires: 365 })
getCookie('name') // => 'value'
removeCookie('name')
```

### path

A [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) indicating the path where the cookie is visible.

**Default:** `/`

**Examples:**

```javascript
setCookie('name', 'value', { path: '' })
getCookie('name') // => 'value'
removeCookie('name', { path: '' })
```

### domain

A [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) indicating a valid domain where the cookie should be visible. The cookie will also be visible to all subdomains.

**Default:** Cookie is visible only to the domain or subdomain of the page where the cookie was created, except for Internet Explorer (see below).

**Examples:**

Assuming a cookie that is being created on `site.com`:

```javascript
setCookie('name', 'value', { domain: 'subdomain.site.com' })
getCookie('name') // => undefined (need to read at 'subdomain.site.com')
```

### secure

Either `true` or `false`, indicating if the cookie transmission requires a secure protocol (https).

**Default:** No secure protocol requirement.

**Examples:**

```javascript
setCookie('name', 'value', { secure: true })
getCookie('name') // => 'value'
removeCookie('name')
```

### sameSite

A [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), allowing to control whether the browser is sending a cookie along with cross-site requests.

Default: not set.

**Note that more recent browsers are making "Lax" the default value even without specifiying anything here.**

**Examples:**

```javascript
setCookie('name', 'value', { sameSite: 'strict' })
getCookie('name') // => 'value'
removeCookie('name')
```

## Codec

### Decode

All get methods that rely on a proper decoding to work, such as `getCookies()` and `getCookie()`, will run the given decoder for each cookie. The returned value will be used as the cookie value.

Example from reading one of the cookies that can only be decoded using the `escape` function:

```typescript
import { DEFAULT_CODEC, getCookie, getCookies } from 'ts-cookie'

document.cookie = 'escaped=%u5317'
document.cookie = 'default=%E5%8C%97'

const read: Decoder<string> = (value, name) => {
  if (name === 'escaped') {
    return unescape(value)
  }
  // Fall back to default for all other cookies
  return DEFAULT_CODEC.decodeValue(value, name)
}

getCookie('escaped', read) // => '北'
getCookie('default', read) // => '北'
getCookies(read) // => { escaped: '北', default: '北' }
```

### Encode

Set a cookie with overriding the default encoding implementation:

```typescript
import { setCookie } from 'ts-cookie'

const write: Encoder<string> = (value) => value.toUpperCase()

setCookie('uppercased', 'foo', undefined, write) // => 'uppercased=FOO; path=/'
```

## js-cookie compatibility

To ease migration while getting full TypeScript support there's a compat module that provides an api similar to [js-cookie](https://github.com/js-cookie/js-cookie):

```typescript
import Cookies from 'ts-cookie'
```

## Testing

```
$ npm test
```

Run tests continuously:

```
$ npm test -- --watch
```

## Security

For vulnerability reports, send an e-mail to `ts-cookie at googlegroups dot com`

## Releasing

We are using [release-it](https://www.npmjs.com/package/release-it) for automated releasing.

Start a dry run to see what would happen:

```
$ npm run release minor -- --dry-run
```

Do a real release (publishes both to npm as well as create a new release on GitHub):

```
$ npm run release minor
```

_GitHub releases are created as a draft and need to be published manually!
(This is so we are able to craft suitable release notes before publishing.)_

## Supporters

<p>
  <a href="https://www.browserstack.com/"><img src="https://raw.githubusercontent.com/wiki/js-cookie/js-cookie/Browserstack-logo%402x.png" width="150"></a>
</p>

Many thanks to [BrowserStack](https://www.browserstack.com/) for providing unlimited browser testing free of cost.
