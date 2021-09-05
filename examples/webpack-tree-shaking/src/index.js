// Illustrate tree shaking here.. Webpack should not include
// anything else apart from getCookie + decoders from ts-cookie
// in the bundled file!
import { getCookie } from 'ts-cookie'

getCookie('foo')
