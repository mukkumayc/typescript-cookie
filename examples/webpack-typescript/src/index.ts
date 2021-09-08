import { Types as CookieTypes, getCookie } from 'typescript-cookie'
// import { Cookies } from 'typescript-cookie/compat' <= package.json `export` submodule not yet supported in TypeScript
import Cookies from 'typescript-cookie/dist/src/compat'

const customDecoder: CookieTypes.Decoder<string> = (value) =>
  value.toUpperCase()
getCookie('foo', { decodeValue: customDecoder })
Cookies.withConverter({ read: customDecoder }).get('foo')
