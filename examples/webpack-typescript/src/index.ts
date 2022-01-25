import { Cookies, getCookie } from 'typescript-cookie'
import type { Types as CookieTypes } from 'typescript-cookie'

const customDecoder: CookieTypes.Decoder<string> = (value) =>
  value.toUpperCase()
getCookie('foo', { decodeValue: customDecoder })
Cookies.withConverter({ read: customDecoder }).get('foo')
