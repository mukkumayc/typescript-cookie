import { Types as CookieTypes, getCookie } from 'ts-cookie'
// import { Cookies } from 'ts-cookie/compat' <= package.json `export` submodule not yet supported in TypeScript
import Cookies from 'ts-cookie/dist/src/compat'

const customDecoder: CookieTypes.Decoder<string> = (value) =>
  value.toUpperCase()
getCookie('foo', { decodeValue: customDecoder })
Cookies.withConverter({ read: customDecoder }).get('foo')
